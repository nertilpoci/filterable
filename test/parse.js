var assert = require('assert');
var filterable = require('../');

function assertQuery(q, out) {
    assert.deepEqual(filterable.Query(q).parse().toJSON(), out);
}

describe('Query#parse', function() {

    it('can parse =', function() {
        assertQuery('name:"Samy"', [
            {
                type: '=',
                field: 'name',
                value: 'Samy',
                originalField: 'name'
            }
        ]);
    });

    it('can parse = with quotation marks', function() {
        assertQuery('name:"Samy Pesse"', [
            {
                type: '=',
                field: 'name',
                value: 'Samy Pesse',
                originalField: 'name'
            }
        ]);
    });

    it('can convert NOT', function() {
        assertQuery("NOT name:Samy", [
            {
                type: '!=',
                field: 'name',
                value: 'Samy',
                originalField: 'name'
            }
        ]);
    });

    it('can convert NOT (only next condition)', function() {
        assertQuery("NOT name:Samy followers:10",[
            {
                type: '!=',
                field: 'name',
                value: 'Samy',
                originalField: 'name'
            },
            {
                type: '=',
                field: 'followers',
                value: '10',
                originalField: 'followers'
            }
        ]);
    });

    it('can detect complete queries', function() {
        var q = filterable.Query('followers:>=100').parse();
        assert.equal(q.isComplete(), true);
    });

    it('can detect non-complete queries', function() {
        var q = filterable.Query('followers:>=100 invalid:test', { rejected: ['invalid'] }).parse();
        assert.equal(q.isComplete(), false);
    });
});
