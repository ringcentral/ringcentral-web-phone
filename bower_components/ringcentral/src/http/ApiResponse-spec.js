import {expect, getSdk, getMock} from '../test/test';
import SDK from '../SDK';

describe('RingCentral.http.ApiResponse', function() {

    var ApiResponse = SDK.http.ApiResponse;

    function createResponse(status, statusText, body, headers) {
        if (!headers) headers = jsonResponseHeaders;
        body = headers.trim() + '\n\n' + body;
        return ApiResponse.create(body, status, statusText);
    }

    var goodMultipartMixedResponse =
            '--Boundary_1245_945802293_1394135045248\n' +
            'Content-Type: application/json\r\n' +
            '\r\n' +
            '{\n' +
            '  "response" : [ {\n' +
            '    "status" : 200\n' +
            '  }, {\n' +
            '    "status" : 200\n' +
            '  } ]\n' +
            '}\n' +
            '--Boundary_1245_945802293_1394135045248\n' +
            'Content-Type: application/json\n' +
            '\n' +
            '{\n' +
            '  "foo" : "bar"\n' +
            '}\n' +
            '--Boundary_1245_945802293_1394135045248\n' +
            'Content-Type: application/json\n' +
            '\n' +
            '{\n' +
            '  "baz" : "qux"\n' +
            '}\n' +
            '--Boundary_1245_945802293_1394135045248--\n',

        multipartMixedResponseWithErrorPart =
            '--Boundary_1245_945802293_1394135045248\n' +
            'Content-Type: application/json\n' +
            '\n' +
            '{\n' +
            '  "response" : [ {\n' +
            '    "status" : 200\n' +
            '  }, {\n' +
            '    "status" : 404\n' +
            '  }, {\n' +
            '    "status" : 200\n' +
            '  } ]\n' +
            '}\n' +
            '--Boundary_1245_945802293_1394135045248\n' +
            'Content-Type: application/json\n' +
            '\n' +
            '{\n' +
            '  "foo" : "bar"\n' +
            '}\n' +
            '--Boundary_1245_945802293_1394135045248\n' +
            'Content-Type: application/json\n' +
            '\n' +
            '{\n' +
            '  "message" : "object not found"\n' +
            '}\n' +
            '--Boundary_1245_945802293_1394135045248\n' +
            'Content-Type: application/json\n' +
            '\n' +
            '{\n' +
            '  "baz" : "qux"\n' +
            '}\n' +
            '--Boundary_1245_945802293_1394135045248--\n',

        badMultipartMixedResponse =
            '--Boundary_1245_945802293_1394135045248\n' +
            'Content-Type: application/json\n' +
            '\n' +
            'THIS IS JUNK AND CANNOT BE PARSED AS JSON\n' +
            '--Boundary_1245_945802293_1394135045248\n' +
            'Content-Type: application/json\n' +
            '\n' +
            '{\n' +
            '  "foo" : "bar"\n' +
            '}\n' +
            '--Boundary_1245_945802293_1394135045248\n' +
            'Content-Type: application/json\n' +
            '\n' +
            '{\n' +
            '  "baz" : "qux"\n' +
            '}\n' +
            '--Boundary_1245_945802293_1394135045248--\n',

        multipartResponseHeaders = 'content-type: multipart/mixed; boundary=Boundary_1245_945802293_1394135045248',
        jsonResponseHeaders = 'content-type: application/json; encoding=utf8';

    describe('constructor tests', function() {

        it('parses headers into object', function() {

            expect(createResponse(200, 'OK', '{}', jsonResponseHeaders)['_isJson']()).to.equal(true);
            expect(createResponse(207, 'Multi-Status', '{}', multipartResponseHeaders)['_isMultipart']()).to.equal(true);

        });

        it('calls the success callback after parsing a good multi-part/mixed response', function() {

            var response = createResponse(207, 'Multi-Status', goodMultipartMixedResponse, multipartResponseHeaders);

            expect(()=> {
                response.multipart();
            }).to.not.throw(Error);

        });

        it('calls the success callback for all individual parts that are parsed (including errors)', function() {

            var res = createResponse(207, 'Multi-Status', multipartMixedResponseWithErrorPart, multipartResponseHeaders);
            expect(res.text()).to.equal(multipartMixedResponseWithErrorPart);

            var multipart = res.multipart();

            expect(multipart.length).to.equal(3);

            //expect(res.data[0]).to.be.instanceOf(r.Response); //FIXME
            expect(multipart[0].error()).to.be.equal(null);
            expect(multipart[0].json().foo).to.be.equal('bar');
            expect(multipart[0].response().status).to.be.equal(200);

            //expect(res.data[1]).to.be.instanceOf(r.Response); //FIXME
            expect(multipart[1].error()).to.be.not.equal(null);

            //expect(res.data[2]).to.be.instanceOf(r.Response); //FIXME
            expect(multipart[2].error()).to.be.equal(null);
            expect(multipart[2].json().baz).to.be.equal('qux');
            expect(multipart[2].response().status).to.be.equal(200);

        });

        it('calls the error callback if it fails to parse the parts info block', function() {

            var response = createResponse(207, 'Multi-Status', badMultipartMixedResponse, multipartResponseHeaders);

            expect(() => {
                response.multipart();
            }).to.throw(Error);

        });

        it('calls the error callback if it is unable to parse the JSON data, passing the error object', function() {

            var response = createResponse(200, 'OK', 'THIS IS JUNK', jsonResponseHeaders);

            expect(()=>{
                response.json();
            }).to.throw(Error);

        });

        it('uses the error_description property of the JSON data when there is an error but no message property', function() {

            var response = createResponse(404, 'Error', '{"error_description": "ERROR"}', jsonResponseHeaders);

            expect(response.error()).to.equal('ERROR');

        });

        it('uses the description property of the JSON data when there is an error but no message or error_description properties', function() {

            var response = createResponse(404, 'Error', '{"description": "ERROR"}', jsonResponseHeaders);

            expect(response.error()).to.equal('ERROR');

        });

        it('parses empty response', function() {

            var response = createResponse(204, 'No Content', '', jsonResponseHeaders);

            expect(response.error()).to.equal(null);
            expect(response.json()).to.equal(null);

        });

    });

});
