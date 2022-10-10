import { ModuleMethod } from './module-method';
import { ModuleApiService } from './module-api-service';
import { NavItem } from './nav-item';

/**
 * Every tool module needs to provide this class to the module service
 * to register itself.
 */
export class Module {
  /**
   * Every module belongs to a list. This is used to show the module
   * in the tools overview in a specific list.
   */
  readonly list: string;

  /**
   * Every module needs a unique name.
   */
  readonly name: string;

  /**
   * Every module can define arbitrary many methods that can be used
   * to define execution steps.
   */
  readonly methods: { [name: string]: ModuleMethod };

  /**
   * Navigation items to be added to the navigation in the main app.
   * Navigation items with the same name as items that are already
   * added to the navigation bar are either overwritten or merged.
   */
  readonly navigation: NavItem[];

  /**
   * The service that will be called if a method of this module is called.
   */
  readonly service: ModuleApiService;

  /**
   * Create a new module. You need to add it via the module service.
   *
   * @param list
   * @param name
   * @param methods
   * @param service
   * @param navigation
   */
  constructor(
    list: string,
    name: string,
    methods: ModuleMethod[],
    service: ModuleApiService,
    navigation: NavItem[]
  ) {
    this.list = list;
    this.name = name;
    this.methods = Object.fromEntries(
      methods.map((method) => [method.name, method])
    );
    this.navigation = navigation;
    this.service = service;
  }

  /**
   * Get all names of the methods that this module defines.
   */
  get methodNames(): string[] {
    return Object.keys(this.methods);
  }
}
