describe("API Test", function () {
	it("Should be configured", function () {
		
		var config = {
				baseUrl: "http://kapta.gennera.com.br/",
				nocache: false,
				resources: {
					app: {},
					formulario: {
						resources: {
							resposta: {
								resources: {
									lancamento: {}
								},
							},
							relatorio: {},
							comunicado: {}
						},
						beforeSave: function (data) {
							data.metadata = JSON.stringify(data.metadata);
							return data;
						}
					},
					smtp: {
						operations: {
							testar: {
								method: "put"
							},
							homologar: {
								method: "post"
							},
							confirmar: {
								method: "get"
							}
						}
					},
					portador: {},
					pergunta: {}
				}
			};
		
		var http = {
				get: function (url) {
					return "GET(" + url + ")";
				},
				post: function (url, data) {
					return "POST(" + url + ")";
				},
				put: function (url, data) {
					return "PUT(" + url + ")";
				},
				delete: function (url) {
					return "DELETE(" + url + ")";
				}
			};

			var api = buildApi(config, http);

			expect(api.app.get(1)).toBe("GET(http://kapta.gennera.com.br/app/1)");
			expect(api.formulario.list({fields: "id,hash,titulo,tags,seguranca"})).toBe("GET(http://kapta.gennera.com.br/formulario?fields=id,hash,titulo,tags,seguranca)");
			expect(api.smtp.save({})).toBe("POST(http://kapta.gennera.com.br/smtp)");
			expect(api.smtp.getOperations(2).testar({})).toBe("PUT(http://kapta.gennera.com.br/smtp/2/testar)");
			expect(api.smtp.getOperations().homologar({})).toBe("POST(http://kapta.gennera.com.br/smtp/homologar)");
			expect(api.smtp.getOperations(2).confirmar()).toBe("GET(http://kapta.gennera.com.br/smtp/2/confirmar)");
			expect(api.portador.get(3)).toBe("GET(http://kapta.gennera.com.br/portador/3)");
			expect(api.pergunta.update(4, {})).toBe("PUT(http://kapta.gennera.com.br/pergunta/4)");
			expect(api.formulario.getResources(5).resposta.delete(9)).toBe("DELETE(http://kapta.gennera.com.br/formulario/5/resposta/9)");
			expect(api.formulario.getResources(6).relatorio.get(10)).toBe("GET(http://kapta.gennera.com.br/formulario/6/relatorio/10)");
			expect(api.formulario.getResources(7).comunicado.get(11)).toBe("GET(http://kapta.gennera.com.br/formulario/7/comunicado/11)");
			expect(api.formulario.getResources(8).resposta.getResources(12).lancamento.get(13)).toBe("GET(http://kapta.gennera.com.br/formulario/8/resposta/12/lancamento/13)");
			expect(api.formulario.save({})).toBe("POST(http://kapta.gennera.com.br/formulario)");
	});
});