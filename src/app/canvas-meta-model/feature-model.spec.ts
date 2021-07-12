import { FeatureModel } from './feature-model';
import { Feature, FeatureType, SubfeatureConnectionsType } from './feature';
import { RelationshipType } from './relationships';
import { Instance } from './instance';

describe('FeatureModel', () => {

  let featureModel: FeatureModel;

  beforeEach(() => {
    featureModel = new FeatureModel({name: 'Test Model'});
  });

  it('should be created', () => expect(featureModel).toBeTruthy());

  it('should be formal consistent', () => expect(() => featureModel.checkFormalConsistency()).not.toThrow());

  it('should be possible to instantiate', () => expect(featureModel.instanceIsPossible().problems).toEqual([]));

  it('should not violate supports-hurts', () => expect(featureModel.checkHurtsSupports().problems).toEqual([]));

  it('should not be possible to remove root features', () =>
    expect(() => featureModel.removeFeature('value-propositions')).toThrow()
  );

  it('should be possible to add a feature', () => {
    const feature = featureModel.addFeature({name: 'Test Feature'}, 'value-propositions');
    expect(feature.parent).toBe(featureModel.getFeature('value-propositions'));
    expect(feature.id).toBe('test-feature');
    expect(feature.subfeatureConnections).toBe(null);
    expect(feature.type).toBe(FeatureType.OPTIONAL);
    expect(feature.level).toBe(2);
  });

  it('should be possible to delete a feature', () => {
    const feature = featureModel.addFeature({name: 'Test Feature'}, 'value-propositions');
    featureModel.removeFeature(feature.id);
    expect(() => featureModel.getFeature(feature.id)).toThrow();
  });

  it('should give every feature a unique feature id', () => {
    const feature1 = featureModel.addFeature({name: 'Test Feature'}, 'value-propositions');
    const feature2 = featureModel.addFeature({name: 'Test Feature'}, 'value-propositions');
    const feature3 = featureModel.addFeature({name: 'Test Feature'}, 'value-propositions');
    const feature4 = featureModel.addFeature({name: 'Test Feature 1'}, 'value-propositions');
    const feature5 = featureModel.addFeature({name: 'Test Feature 1'}, 'value-propositions');
    expect(feature1.id).toBe('test-feature');
    expect(feature2.id).toBe('test-feature-1');
    expect(feature3.id).toBe('test-feature-2');
    expect(feature4.id).toBe('test-feature-1-1');
    expect(feature5.id).toBe('test-feature-1-2');
    featureModel.removeFeature(feature1.id);
    const feature6 = featureModel.addFeature({name: 'Test Feature'}, 'value-propositions');
    expect(feature6.id).toBe('test-feature-3');
  });

  it('should be possible to update a feature', () => {
    let feature = featureModel.addFeature({name: 'Test Feature'}, 'value-propositions');
    const id = feature.id;
    featureModel.updateFeature(id, 'channels', {name: 'Updated Feature', description: 'New description', type: FeatureType.MANDATORY});
    feature = featureModel.getFeature(id);
    expect(feature.id).toBe(id);
    expect(feature.type).toBe(FeatureType.MANDATORY);
    expect(feature.name).toBe('Updated Feature');
    expect(feature.description).toBe('New description');
    expect(feature.parent).toBe(featureModel.getFeature('channels'));
    expect(Object.keys(featureModel.getFeature('value-propositions').subfeatures)).not.toContain(id);
  });

  describe('when adding a relationship', () => {

    let featureA: Feature;
    let featureB: Feature;

    beforeEach(() => {
      featureA = featureModel.addFeature({name: 'Feature A'}, 'value-propositions');
      featureB = featureModel.addFeature({name: 'Feature B'}, 'channels');
      featureModel.addRelationship(RelationshipType.REQUIRES, featureA.id, featureB.id);
    });

    it('should be defined in a', () => {
      expect(featureA.relationships.requires).toContain(featureB.id);
    });

    it('should not be defined in b', () => {
      expect(featureB.relationships.hasNoRelationships()).toBe(true);
    });

    it('should not be possible to define the relationship two times', () => {
      featureModel.addRelationship(RelationshipType.REQUIRES, featureA.id, featureB.id);
      expect(featureA.relationships.requires).toEqual([featureB.id]);
    });

    it('should be possible to remove the relationship', () => {
      featureModel.removeRelationship(RelationshipType.REQUIRES, featureA.id, featureB.id);
      expect(featureA.relationships.hasNoRelationships()).toBe(true);
    });

  });

  describe('when adding an instance', () => {

    let instance: Instance;

    beforeEach(() => {
      instance = featureModel.addInstance({name: 'Test Instance'});
    });

    it('should be accessible', () => {
      expect(featureModel.instances.length).toBe(1);
      expect(featureModel.getInstance(instance.id)).toBeTruthy();
    });

    it('should be formal consistent', () => expect(() => featureModel.checkFormalConsistency()).not.toThrow());

    it('should be conform', () => {
      const conformance = featureModel.checkConformanceOfInstance(instance.id, []);
      expect(conformance.warnings).toEqual([]);
      expect(conformance.warningFeatureIds).toEqual([]);
      expect(conformance.errors).toEqual([]);
      expect(conformance.errorFeatureIds).toEqual([]);
    });

    it('should be removable', () => {
      featureModel.removeInstance(instance.id);
      expect(featureModel.instances.length).toBe(0);
      expect(featureModel.getInstance(instance.id)).toBeFalsy();
    });

    describe('and adding features', () => {

      let featureA: Feature;
      let featureB: Feature;

      beforeEach(() => {
        featureA = featureModel.addFeature({name: 'Test Feature'}, 'value-propositions');
        featureB = featureModel.addFeature({name: 'Inner Feature'}, featureA.id);
      });

      it('should be possible to use the features in the instance', () => {
        expect(instance.usedFeatures).not.toContain(featureA.id);
        featureModel.addFeatureToInstance(instance.id, featureA.id);
        expect(instance.usedFeatures).toContain(featureA.id);
      });

      it('should be possible to remove the feature from the instance after adding it', () => {
        expect(instance.usedFeatures).not.toContain(featureA.id);
        featureModel.addFeatureToInstance(instance.id, featureA.id);
        featureModel.removeFeatureFromInstance(instance.id, featureA.id);
        expect(instance.usedFeatures).not.toContain(featureA.id);
      });

      it('should delete inner feature decisions', () => {
        featureModel.addFeatureToInstance(instance.id, featureA.id);
        featureModel.addFeatureToInstance(instance.id, featureB.id);
        expect(instance.usedFeatures).toContain(featureA.id);
        expect(instance.usedFeatures).toContain(featureB.id);
        featureModel.removeFeatureFromInstance(instance.id, featureA.id);
        expect(instance.usedFeatures).not.toContain(featureA.id);
        expect(instance.usedFeatures).not.toContain(featureB.id);
      });

    });

  });

  it('should not export feature description as null', () => {
    const feature = featureModel.addFeature({name: 'Test Feature', description: null}, 'value-propositions');
    const json: Partial<FeatureModel> = JSON.parse(JSON.stringify(featureModel));
    expect(json.features['value-propositions'].subfeatures[feature.id]).not.toEqual(jasmine.objectContaining({
      description: null
    }));
  });

  it('should find circular requires-excludes', () => {
    const featureA = featureModel.addFeature({name: 'Feature A', type: FeatureType.MANDATORY}, 'value-propositions');
    const featureB = featureModel.addFeature({name: 'Feature B'}, 'value-propositions');
    const featureC = featureModel.addFeature({name: 'Feature C'}, 'value-propositions');
    featureModel.addRelationship(RelationshipType.REQUIRES, featureA.id, featureB.id);
    featureModel.addRelationship(RelationshipType.REQUIRES, featureB.id, featureC.id);
    featureModel.addRelationship(RelationshipType.EXCLUDES, featureC.id, featureA.id);
    const result = featureModel.instanceIsPossible();
    expect(result.problems.length).toBeGreaterThan(0);
    expect(result.problemFeatureIds.length).toBe(1);
    expect(result.problemFeatureIds).toContain(featureC.id);
  });

  it('should find xor too many required', () => {
    const featureA = featureModel.addFeature({
      name: 'Feature A',
      type: FeatureType.MANDATORY,
      subfeatureConnections: SubfeatureConnectionsType.XOR
    }, 'value-propositions');
    featureModel.addFeature({name: 'Feature B', type: FeatureType.MANDATORY}, featureA.id);
    featureModel.addFeature({name: 'Feature C', type: FeatureType.MANDATORY}, featureA.id);
    const result = featureModel.instanceIsPossible();
    expect(result.problems.length).toBeGreaterThan(0);
    expect(result.problemFeatureIds.length).toBe(1);
    expect(result.problemFeatureIds).toContain(featureA.id);
  });

  it('should not find nested problems', () => {
    const featureA = featureModel.addFeature({
      name: 'Feature A',
      subfeatureConnections: SubfeatureConnectionsType.XOR
    }, 'value-propositions');
    featureModel.addFeature({name: 'Feature B', type: FeatureType.MANDATORY}, featureA.id);
    featureModel.addFeature({name: 'Feature C', type: FeatureType.MANDATORY}, featureA.id);
    const result = featureModel.instanceIsPossible();
    expect(result.problems).toEqual([]);
  });

  it('should find excluded or subfeature', () => {
    const featureA = featureModel.addFeature({
      name: 'Feature A',
      type: FeatureType.MANDATORY,
      subfeatureConnections: SubfeatureConnectionsType.OR
    }, 'value-propositions');
    const featureB = featureModel.addFeature({name: 'Feature B', type: FeatureType.MANDATORY}, 'value-propositions');
    const featureC = featureModel.addFeature({name: 'Feature C'}, featureA.id);
    featureModel.addRelationship(RelationshipType.EXCLUDES, featureB.id, featureC.id);
    const result = featureModel.instanceIsPossible();
    expect(result.problems.length).toBeGreaterThan(0);
    expect(result.problemFeatureIds.length).toBe(1);
    expect(result.problemFeatureIds).toContain(featureB.id);
  });

  it('should find or without subfeatures', () => {
    const featureA = featureModel.addFeature({
      name: 'Feature A',
      type: FeatureType.MANDATORY,
      subfeatureConnections: SubfeatureConnectionsType.OR
    }, 'value-propositions');
    const result = featureModel.instanceIsPossible();
    expect(result.problems.length).toBeGreaterThan(0);
    expect(result.problemFeatureIds.length).toBe(1);
    expect(result.problemFeatureIds).toContain(featureA.id);
  });

  it('should allow circular requires', () => {
    const featureA = featureModel.addFeature({name: 'Feature A', type: FeatureType.MANDATORY}, 'channels');
    const featureB = featureModel.addFeature({name: 'Feature B'}, 'value-propositions');
    const featureC = featureModel.addFeature({name: 'Feature C'}, 'value-propositions');
    featureModel.addRelationship(RelationshipType.REQUIRES, featureA.id, featureB.id);
    featureModel.addRelationship(RelationshipType.REQUIRES, featureB.id, featureC.id);
    featureModel.addRelationship(RelationshipType.REQUIRES, featureC.id, featureA.id);
    const result = featureModel.instanceIsPossible();
    expect(result.problems).toEqual([]);
    expect(result.possibleInstance.usedFeatures).toContain(featureA.id);
    expect(result.possibleInstance.usedFeatures).toContain(featureB.id);
    expect(result.possibleInstance.usedFeatures).toContain(featureC.id);
  });

  it('should select correct or subfeature', () => {
    featureModel.updateFeature('value-propositions', null, {subfeatureConnections: SubfeatureConnectionsType.OR});
    const featureA = featureModel.addFeature({name: 'Feature A'}, 'value-propositions');
    const featureB = featureModel.addFeature({name: 'Feature B'}, 'value-propositions');
    const featureC = featureModel.addFeature({name: 'Feature C', type: FeatureType.MANDATORY}, 'channels');
    featureModel.addRelationship(RelationshipType.EXCLUDES, featureC.id, featureA.id);
    const result = featureModel.instanceIsPossible();
    expect(result.problems).toEqual([]);
    expect(result.possibleInstance.usedFeatures).not.toContain(featureA.id);
    expect(result.possibleInstance.usedFeatures).toContain(featureB.id);
    expect(result.possibleInstance.usedFeatures).toContain(featureC.id);
  });

  it('should find two required xor features', () => {
    featureModel.updateFeature('value-propositions', null, {subfeatureConnections: SubfeatureConnectionsType.XOR});
    const featureA = featureModel.addFeature({name: 'Feature A'}, 'value-propositions');
    const featureB = featureModel.addFeature({name: 'Feature B'}, 'value-propositions');
    const featureC = featureModel.addFeature({name: 'Feature C', type: FeatureType.MANDATORY}, 'channels');
    featureModel.addRelationship(RelationshipType.REQUIRES, featureC.id, featureA.id);
    featureModel.addRelationship(RelationshipType.REQUIRES, featureC.id, featureB.id);
    const result = featureModel.instanceIsPossible();
    expect(result.problems.length).toBeGreaterThan(0);
    expect(result.problemFeatureIds.length).toBe(1);
    expect(result.problemFeatureIds).toContain('value-propositions');
  });

  it('should find excluded parent', () => {
    const featureA = featureModel.addFeature({name: 'Feature A', type: FeatureType.MANDATORY}, 'value-propositions');
    const featureB = featureModel.addFeature({name: 'Feature B'}, 'customer-segments');
    const featureC = featureModel.addFeature({name: 'Feature C'}, featureB.id);
    const featureD = featureModel.addFeature({name: 'Feature D', type: FeatureType.MANDATORY}, 'channels');
    featureModel.addRelationship(RelationshipType.REQUIRES, featureA.id, featureC.id);
    featureModel.addRelationship(RelationshipType.EXCLUDES, featureD.id, featureB.id);
    const result = featureModel.instanceIsPossible();
    expect(result.problems.length).toBeGreaterThan(0);
    expect(result.problemFeatureIds.length).toBe(1);
    expect(result.problemFeatureIds).toContain(featureD.id);
  });

  it('should find supports-hurts', () => {
    const featureA = featureModel.addFeature({name: 'Feature A'}, 'value-propositions');
    const featureB = featureModel.addFeature({name: 'Feature B'}, 'customer-segments');
    featureModel.addRelationship(RelationshipType.SUPPORTS, featureA.id, featureB.id);
    featureModel.addRelationship(RelationshipType.HURTS, featureB.id, featureA.id);
    const result = featureModel.checkHurtsSupports();
    expect(result.problems.length).toBeGreaterThan(0);
    expect(result.problemFeatureIds.length).toBe(2);
    expect(result.problemFeatureIds).toContain(featureA.id);
    expect(result.problemFeatureIds).toContain(featureB.id);
  });

  it('should only report important errors', () => {
    featureModel.updateFeature('value-propositions', null, {subfeatureConnections: SubfeatureConnectionsType.OR});
    const featureA = featureModel.addFeature({name: 'Feature A'}, 'value-propositions');
    featureModel.addFeature({name: 'Feature B'}, 'value-propositions');
    const featureC = featureModel.addFeature({
      name: 'Feature C',
      type: FeatureType.MANDATORY,
      subfeatureConnections: SubfeatureConnectionsType.XOR
    }, 'customer-segments');
    featureModel.addRelationship(RelationshipType.EXCLUDES, featureA.id, featureC.id);
    const result = featureModel.instanceIsPossible();
    expect(result.problems.length).toBeGreaterThan(0);
    expect(result.problemFeatureIds.length).toBe(1);
    expect(result.problemFeatureIds).toContain(featureC.id);
    expect(result.problems.length).toBe(1);
  });

});
