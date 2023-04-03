# Situational Business Model Developer

The Situational Business Model Developer (SBMD) is a software tool for a novel approach to support the situation-specific business model development. That development aims to adjust the business model development methods as well as the business models to the actual situation of the developing organization. 

## Introduction

The development of new business models is essential for startups to become successful, as well as for established companies to explore new business opportunities. However, developing such business models is a challenging activity. On the one hand, various tasks (e.g., conducting customer interviews) of business model development methods (BMDMs) need to be performed. On the other hand, different decisions (e.g., advertisements as a revenue stream) for the business models (BMs) need to be made. Both have to fit the changeable situation of the organization (e.g., availability of financial resources, mobile apps as application domain) in which the business model is developed to reduce the risk of developing ineffective business models with low market penetration. Therefore, the BMDMs and the BMs must be developed situation-specific. This situation-specific adaptation has already proven its value in Situational Method Engineering (SME), in which situation-specific software development methods are constructed from fragments of a method repository.

Our solution is a novel approach for the situation-specific development of business models with three stages. In the first stage, we create a method repository with method fragments for the BMDMs and a canvas model repository with modeling fragments for the BMs. Both repositories are filled by the knowledge of domain experts. Out of these repositories, in the second stage, situation-specific BMDMs for developing situation-specific BMs are composed by a method engineer based on the changeable situation of the organization and enacted by a business developer. The business developer collaborates with other stakeholders (e.g., software developer) during the enaction to create artifacts. Moreover, in the third stage, he receives IT support (e.g., design suggestions for the business model) provided by development support engineers in different development steps. For all stages, our SBMD can be used and extended with own modules.

A more detailed introduction to the different stages is provided [here](STAGES.md).
## Tool Overview
The usage of our tool can be discovered in a small demonstration video. However, the video currently is based on an older version of the tool and covers just the first and the second stage of our approach. A new video will be available soon.

[![Video for the Situational Business Model Developer](https://img.youtube.com/vi/1VszYMIb4xo/0.jpg)](https://www.youtube.com/watch?v=1VszYMIb4xo)


A live demonstration of our tool is provided [here](https://sebastiangtts.github.io/situational-business-model-developer). Moreover, we provide a tutorial mode inside the tool for guidance in the most important features.



## Installation

1. Install [NodeJS](https://nodejs.org) and [AngularCLI](https://cli.angular.io/)
2. Clone Situational Business Model Developer repository to your computer
3. Install all NPM packages with `npm install`
4. Configure database 4.1. Internal database: By default the feature modeler is using PouchDB zu store data directly in
   the web storage of the browser. The database can be changed in `src/app/pouchdb.service.ts` within the
   variable `databaseName` (default: `bmdl-feature-modeler`)
   4.2. External database: The feature modeler allows also to use a CouchDB database as a persistent storage. For this,
   you need to change the `databaseName` in `src/app/pouchdb.service.ts` to `http://localhost:4200/database` and specify
   the url to the CouchDB in `proxy.conf.json` within the variable `target` (
   default: `http://localhost:5984/bmdl-modeler`)
5. Start service 5.1. Internal database: Run the web application with `ng serve`
   5.2. External database: Run the web application with `npm start` to use the proxy for the external database
6. Have fun with the tool :)

Moreover, you probaly want to also develop your own modules. A description to develop you own modules is provided [here](MODULES.md).

## Further Information

- **Live Demonstration:** 
  - GH-Pages: http://sebastiangtts.github.io/situational-business-model-developer/
- **Modularized Solution:** 
  - Continuous situation-specific development of business models: knowledge provision, method composition, and method enactment [(Access Preprint)](https://www.researchgate.net/publication/361844967_Continuous_situation-specific_development_of_business_models_knowledge_provision_method_composition_and_method_enactment)
  - Situation-Specific Business Model Development Methods for Mobile App Developers [(Access Preprint)](https://www.researchgate.net/publication/352476162_Situation-Specific_Business_Model_Development_Methods_for_Mobile_App_Developers)
  - Situation- and Domain-Specific Composition and Enactment of Business Model Development Methods [(Access Preprint)](https://www.researchgate.net/publication/355368661_Situation-and_Domain-specific_Composition_and_Enactment_of_Business_Model_Development_Methods)
  - Situational Business Model Developer: A Tool-support for Situation-specific Business Model Development [(Access Preprint)](https://www.researchgate.net/publication/356860356_Situational_Business_Model_Developer_A_Tool-support_for_Situation-specific_Business_Model_Development)
- **Modules:**
  - Canvas Module: Extending Business Model Development Tools with Consolidated Expert Knowledge [(Access Preprint)](https://www.researchgate.net/publication/352905879_Extending_Business_Model_Development_Tools_with_Consolidated_Expert_Knowledge)
  - HypoMoMap Module: Model-Based Hypothesis Engineering for Supporting Adaptation to Uncertain Customer Needs [(Access Preprint)](https://www.researchgate.net/publication/342710605_Model-Based_Hypothesis_Engineering_for_Supporting_Adaptation_to_Uncertain_Customer_Needs)
  - Template Module: Towards Software Support for Situation-specific Cross-organizational Design Thinking Processes [(Access Preprint)](https://www.researchgate.net/publication/364226156_Towards_Software_Support_for_Situation-specific_Cross-organizational_Design_Thinking_Processes)

A full list for related publications is provided [here](https://www.researchgate.net/project/Situation-specific-Business-Model-Development).

## License

The Situational Business Model Developer is released under the [MIT license](LICENSE.md).
