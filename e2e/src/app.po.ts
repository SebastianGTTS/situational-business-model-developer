import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';

export class AppPage {

  expertModelList = this.modelList('.expert-model-list');
  companyModelList = this.modelList('.company-model-list');

  async navigateTo() {
    await browser.get(browser.baseUrl);
    await browser.wait(ExpectedConditions.or(
      ExpectedConditions.presenceOf(this.expertModelList.listItems.first()),
      ExpectedConditions.presenceOf(this.companyModelList.listItems.first())
    ));
  }

  getNavbarBrand() {
    return element(by.css('.navbar-brand')).getText() as Promise<string>;
  }

  private modelList(selector: string) {
    const list = element(by.css(selector));
    const listItems = list.all(by.css('.model-list-item'));
    return {
      listItem: list.element(by.css('.model-list-item')),
      listItems,
      expectedListItem: (name: string) =>
        ExpectedConditions.presenceOf(
          listItems.filter(async (item) => await item.element(by.css('strong')).getText() === name).first()
        ),
      findListItem: (name: string) =>
        this.itemToObject(listItems.filter(async (item) => await item.element(by.css('strong')).getText() === name).first()),
      getListItem: (index: number) => this.itemToObject(listItems.get(index)),
      modelNameInput: list.element(by.id('name')),
      modelDescriptionInput: list.element(by.id('description')),
      submitButton: list.element(by.css('button[type=submit]')),
    };
  }

  private itemToObject(item: ElementFinder) {
    return {
      title: item.element(by.css('strong')),
      description: item.element(by.css('span')),
      viewButton: item.element(by.css('.model-list-item-view')),
      editButton: item.element(by.css('.model-list-item-edit')),
      deleteButton: item.element(by.css('.model-list-item-delete')),
    };
  }
}
