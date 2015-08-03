var buildApi = function (config, http) {
	
	var createQueryString = function (queryString) {
		var parameters = [];
		for(parameter in queryString) {
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
		resource.get = function (id) {
			return http.get(addTimestamp(createUrl(parent, resourceName, id)));
		};
		resource.list = function (queryString) {
			return http.get(addTimestamp(createUrl(parent, resourceName, undefined, queryString), queryString));
		};
		resource.save = function (data) {
			if (options.beforeSave) data = options.beforeSave(data);
			return http.post(createUrl(parent, resourceName), data);
		};
		resource.update = function (id, data) {
			return http.put(createUrl(parent, resourceName, id), data);
		};
		resource.delete = function (id) {
			return http.delete(createUrl(parent, resourceName, id));
		};
		
		resource.getOperations = function (id) {
			var url = createUrl(parent, resourceName, id);
			var operations = {};
			for(operation in options.operations) {
				(function (operation) {
					operations[operation] = function (data) {
						var method = options.operations[operation].method;
						return http[method](addTimestamp(url + "/" + operation), data);
					}
				})(operation);
			}
			
			return operations;
		};
		
		return resource;
	};

	var createStructure = function (resources, parent) {
		var structure = {};
		for(resourceChild in resources) {
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