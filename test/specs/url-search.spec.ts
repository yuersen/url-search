import 'mocha';
import { expect } from 'chai';
import URLSearch from '@/url-search';

describe('URLSearch', () => {
  describe('constructor', () => {
    it('create instance with no parameter', () => {
      expect(new URLSearch()).to.be.an.instanceof(URLSearch);
    });

    it('create intance with a string parameter', () => {
      expect(new URLSearch('name=pxy&version=1.0.0')).to.be.an.instanceof(
        URLSearch
      );
    });

    it('create intance with a string parameter which start with "?"', () => {
      expect(new URLSearch('?name=pxy&version=1.0.0')).to.be.an.instanceof(
        URLSearch
      );
    });

    it('input string parameter with name and no value"', () => {
      expect(new URLSearch('?name=pxy&version=')).to.be.an.instanceof(
        URLSearch
      );
    });

    it('create instance with array', () => {
      expect(
        new URLSearch([['name', 'pxy'], ['version', '1.0.0']])
      ).to.be.an.instanceof(URLSearch);
    });

    it('create instance with object', () => {
      expect(
        new URLSearch({ name: 'pxy', version: '1.0.0' })
      ).to.be.an.instanceof(URLSearch);
    });
  });

  describe('append', () => {
    const url = new URLSearch();

    it('if name is undefined, return a new instance.', () => {
      expect(url.append(void 0, 'value')).to.be.an.instanceof(URLSearch);
    });

    it('if value is undefined, return a new instance.', () => {
      expect(url.append('name', void 0)).to.be.an.instanceof(URLSearch);
    });

    it('adds name for the first time to create array cache', () => {
      url.append('name', 'pxy');
      expect(url.getAll('name'))
        .to.be.an('array')
        .length(1);
    });

    it('append a array value', () => {
      url.append('love', ['basketball']);
      expect(url.get('love')).to.be.equal('basketball');
    });
  });

  describe('delete', () => {
    const url = new URLSearch({
      name: 'pxy',
      version: '1.0.0'
    });

    it('delete the given search parameter', () => {
      expect(url.get('name')).to.be.equal('pxy');
      url.delete('name');
      expect(url.get('name')).to.be.null;
    });

    it('the methods return instance', () => {
      expect(url.delete('version')).to.be.an.instanceof(URLSearch);
    });
  });

  describe('get', () => {
    const url = new URLSearch({
      name: 'pxy',
      version: '1.0.0'
    });

    url.append('name', 'fiy');

    it('returns the first value', () => {
      expect(url.get('name')).to.be.equal('pxy');
    });

    it('returns null when the given name is not found', () => {
      expect(url.get('time')).to.be.null;
    });
  });

  describe('getAll', () => {
    const url = new URLSearch({
      name: 'pxy',
      version: '1.0.0'
    });
    url.append('name', 'fiy');

    it('returns all the value', () => {
      expect(url.getAll('name')).to.includes.members(['pxy', 'fiy']);
    });

    it('returns a empty array when the given name is not found', () => {
      expect(url.getAll('time'))
        .to.be.an('array')
        .length(0);
    });
  });

  describe('has', () => {
    const url = new URLSearch('name=pxy&version=1.0.0');

    it('returns true when the given name is found', () => {
      expect(url.has('name')).to.be.true;
    });

    it('returns false when the given is not found', () => {
      expect(url.has('time')).to.be.false;
    });
  });

  describe('set', () => {
    const url = new URLSearch('name=pxy');

    it('deletes existing item', () => {
      expect(url.getAll('name')).to.be.include('pxy');
      url.set('name', 'fiy');
      expect(url.getAll('name')).to.be.include('fiy');
    });
  });

  describe('keys', () => {
    const url = new URLSearch('name=pxy&version=1.0.0');

    it('retuns all keys', () => {
      expect(url.keys()).to.deep.equal(['name', 'version']);
    });
  });

  describe('values', () => {
    const url = new URLSearch('name=pxy&version=1.0.0');

    it('returns all values', () => {
      expect(url.values()).to.deep.equal(['pxy', '1.0.0']);
    });
  });

  describe('entries', () => {
    const url = new URLSearch('name=pxy&version=1.0.0');

    it('returns an object contains all information', () => {
      expect(url.entries()).to.deep.equal([
        ['name', 'pxy'],
        ['version', '1.0.0']
      ]);
    });
  });

  describe('forEach', () => {
    const url = new URLSearch('name=pxy&version=1.0.0');
    const keys: string[] = [];
    const values: any[] = [];
    url.forEach((value, key) => {
      keys.push(key);
      values.push(value);
    });
    expect(keys).to.deep.equal(['name', 'version']);
    expect(values).to.deep.equal(['pxy', '1.0.0']);
  });

  describe('toString', () => {
    it('return url', () => {
      const search = 'name=pxy!fiy&version=1.0.0';
      const url = new URLSearch(search);
      expect(url.toString()).to.equal('name=pxy%21fiy&version=1.0.0');
    });
  });

  describe('sort', () => {
    it('sorts the name', () => {
      const url = new URLSearch('name=pxy&version=1.0.0&love=yz');
      url.sort();
      expect(url.toString()).to.equal('love=yz&name=pxy&version=1.0.0');
    });

    it('sorts the value', () => {
      const url = new URLSearch('name=pxy&version=1.0.0&name=fiy');
      url.sort();
      expect(url.toString()).to.equal('name=fiy&name=pxy&version=1.0.0');
    });
  });
});
