var buildApi = function (config, http) {
	
	var createQueryString = function (queryString) {
		var parameters = [];
		for(var parameter in queryString) {
			parameters.push(parameter + "=" + queryString[parameter]);
		}
		return "?" + parameters.join("&");
	};
	
	var addTimestamp = function (url, queryString) {
	  if (!config.nocache) return url;
	  return url + ((queryString) ? "&" : "?") + "nocache=" + new Date().getTime();
	};
	
	var createUrl = function (parent, resource, id, queryString) {
		return parent + resource + ((id) ? "/" + id : "") + ((queryString) ? createQueryString(queryString) : "");
	};

	var createResource = function (resourceName, parent, options) {
		var resource = {};
		if (options.resources) resource.resource = function (id) {
			return createUrl(parent, resourceName, id) + "/";
		};
		resource.get = function (id, queryString, config) {
			return http.get(addTimestamp(createUrl(parent, resourceName, id, queryString), queryString), config);
		};
		resource.list = function (queryString, config) {
			return http.get(addTimestamp(createUrl(parent, resourceName, undefined, queryString), queryString), config);
		};
		resource.save = function (data, queryString, config) {
			if (options.beforeSave) data = options.beforeSave(data);
			return http.post(createUrl(parent, resourceName, undefined, queryString), data, config);
		};
		resource.update = function (id, data, queryString, config) {
			return http.put(createUrl(parent, resourceName, id, queryString), data, config);
		};
		resource.patch = function (id, data, queryString, config) {
			return http.patch(createUrl(parent, resourceName, id, queryString), data, config);
		};
		resource.delete = function (id, queryString, config) {
			return http.delete(createUrl(parent, resourceName, id, queryString), config);
		};
		
		resource.getOperations = function (id) {
			var url = createUrl(parent, resourceName, id);
			var operations = {};
			for(var operation in options.operations) {
				(function (operation) {
					operations[operation] = function (data, queryString, config) {
						var method = options.operations[operation].method;
						return http[method](addTimestamp(url + "/" + operation + ((queryString) ? createQueryString(queryString) : ""), ((queryString) ? createQueryString(queryString) : "")), data, config);
					}
				})(operation);
			}
			
			return operations;
		};
		
		return resource;
	};

	var createStructure = function (resources, parent) {
		var structure = {};
		for(var resourceChild in resources) {
			structure[resourceChild] = createResource(resourceChild, parent, resources[resourceChild]);
			if (!resources[resourceChild].resources) continue;
			(function (resourceChild) {
				structure[resourceChild].getResources = function (id) {
					return createStructure(resources[resourceChild].resources, structure[resourceChild].resource(id));
				};
			})(resourceChild);
		}
		return structure;
	};

	return createStructure(config.resources, config.baseUrl);
};