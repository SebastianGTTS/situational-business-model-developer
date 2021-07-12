import { AppPage } from './app.po';
import { browser, ExpectedConditions, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display application name', async () => {
    await page.navigateTo();
    expect(await page.getNavbarBrand()).toEqual('BMDL Feature Modeler');
  });

  describe('when adding an expert model', () => {

    beforeAll(async () => {
      page = new AppPage();
      await page.navigateTo();
      await page.expertModelList.modelNameInput.sendKeys('Test Model');
      await page.expertModelList.modelDescriptionInput.sendKeys('Test Description');
      await page.expertModelList.submitButton.click();
      await browser.wait(page.expertModelList.expectedListItem('Test Model'));
    });

    beforeEach(async () => await page.navigateTo());

    it('should be displayed', async () => {
      expect(await page.expertModelList.listItems.count()).toBe(4);
      expect(await page.expertModelList.findListItem('Test Model').description.getText()).toBe('Test Description');
    });

    it('should be able to navigate to view page', async () => {
      await page.expertModelList.getListItem(0).viewButton.click();
      expect(await browser.getCurrentUrl()).toContain('featuremodelview');
    });

    it('should be able to navigate to edit page', async () => {
      await page.expertModelList.getListItem(0).editButton.click();
      expect(await browser.getCurrentUrl()).toContain('featuremodel');
    });

    describe('and deleting', async () => {

      beforeAll(async () => {
        await page.navigateTo();
        await page.expertModelList.findListItem('Test Model').deleteButton.click();
        await browser.wait(ExpectedConditions.not(page.expertModelList.expectedListItem('Test Model')));
      });

      it('should be gone', async () => {
        expect(await page.expertModelList.listItems.count()).toBe(3);
      });

    });

    afterAll(async () => {
      await browser.executeScript('window.localStorage.clear();');
      await browser.executeScript('window.sessionStorage.clear();');
      await browser.executeScript('window.indexedDB.deleteDatabase("_pouch_bmdl-feature-modeler");');
      await browser.driver.manage().deleteAllCookies();
    });

  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
