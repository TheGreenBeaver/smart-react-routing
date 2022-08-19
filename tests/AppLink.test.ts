import { AppLink } from '../src';

describe('AppLink', () => {
  it('Should replace path parameter placeholders with actual values', () => {
    const appLink = new AppLink('/user/:userId/post/:postId');
    expect(appLink.compose(4, 5)).toBe('/user/4/post/5');
  });

  it('Should compose query strings', () => {
    const appLink = new AppLink('/items/:categoryLabel');
    expect(
      appLink.compose('furniture', { shelves: 5, wooden: true })
    ).toBe('/items/furniture/?shelves=5&wooden=true');
  });
});