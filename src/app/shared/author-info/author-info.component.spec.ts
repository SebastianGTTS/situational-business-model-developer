import { AuthorInfoComponent } from './author-info.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { Author } from '../../model/author';

describe('AuthorInfoComponent', () => {
  let spectator: Spectator<AuthorInfoComponent>;
  const createComponent = createComponentFactory({
    component: AuthorInfoComponent,
    declarations: [],
  });

  beforeEach(() => spectator = createComponent({
    props: {
      author: new Author({}),
    }
  }));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
