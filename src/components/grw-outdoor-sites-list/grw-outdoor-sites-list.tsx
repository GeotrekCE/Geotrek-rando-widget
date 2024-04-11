import { Component, Host, h, Element, State, Prop } from '@stencil/core';
import { translate } from 'i18n/i18n';
import state, { onChange } from 'store/store';
import { OutdoorSites } from 'types/types';
@Component({
  tag: 'grw-outdoor-sites-list',
  styleUrl: 'grw-outdoor-sites-list.scss',
  shadow: true,
})
export class GrwOutdoorSitesList {
  @Element() element: HTMLElement;
  @State() outdoorSitesToDisplay: OutdoorSites = [];

  @Prop() fontFamily = 'Roboto';
  @Prop() colorPrimaryApp = '#6b0030';
  @Prop() colorOnSurface = '#49454e';
  @Prop() colorSecondaryContainer = '#e8def8';
  @Prop() colorOnSecondaryContainer = '#1d192b';
  @Prop() colorSurfaceContainerLow = '#f7f2fa';
  @Prop() isLargeView = false;

  step = 10;
  shouldAddInfiniteScrollEvent = true;

  handleInfiniteScrollBind: (event: any) => void = this.handleInfiniteScroll.bind(this);

  connectedCallback() {
    this.handleInfiniteScrollEvent(true);
    if (state.currentOutdoorSites) {
      this.outdoorSitesToDisplay = [...state.currentOutdoorSites.slice(0, this.step)];
    }
    onChange('currentOutdoorSites', () => {
      this.handleInfiniteScrollEvent(true);
      this.element.scroll({ top: 0 });
      if (state.currentOutdoorSites) {
        this.outdoorSitesToDisplay = [...state.currentOutdoorSites.slice(0, this.step)];
      }
    });
    onChange('outdoorSitesWithinBounds', () => {
      this.handleInfiniteScrollEvent(true);
      this.element.scroll({ top: 0 });
      if (state.outdoorSitesWithinBounds) {
        this.outdoorSitesToDisplay = [...state.outdoorSitesWithinBounds.slice(0, this.step)];
      }
    });
  }

  handleInfiniteScroll(event: any) {
    if (event.composedPath()[0].scrollTop + event.composedPath()[0].scrollHeight / 2 >= event.composedPath()[0].scrollHeight) {
      if (this.outdoorSitesToDisplay.length < state.outdoorSitesWithinBounds.length) {
        this.outdoorSitesToDisplay = state.outdoorSitesWithinBounds.slice(
          0,
          this.outdoorSitesToDisplay.length + this.step >= state.outdoorSitesWithinBounds.length
            ? state.outdoorSitesWithinBounds.length
            : this.outdoorSitesToDisplay.length + this.step,
        );
      } else {
        this.handleInfiniteScrollEvent(false);
      }
    }
  }

  handleInfiniteScrollEvent(shouldAddInfiniteScrollEvent: boolean) {
    if (shouldAddInfiniteScrollEvent) {
      if (this.shouldAddInfiniteScrollEvent) {
        this.element.addEventListener('scroll', this.handleInfiniteScrollBind);
        this.shouldAddInfiniteScrollEvent = !shouldAddInfiniteScrollEvent;
      }
    } else {
      this.element.removeEventListener('scroll', this.handleInfiniteScrollBind);
      this.shouldAddInfiniteScrollEvent = !shouldAddInfiniteScrollEvent;
    }
  }

  disconnectedCallback() {
    this.handleInfiniteScrollEvent(false);
  }

  render() {
    return (
      <Host style={{ '--font-family': this.fontFamily, '--color-primary-app': this.colorPrimaryApp }}>
        {state.outdoorSitesWithinBounds && (
          <div part="current-outdoor-sites-within-bounds-length" class="current-outdoor-sites-within-bounds-length">{`${state.outdoorSitesWithinBounds.length} ${
            state.outdoorSitesWithinBounds.length > 1 ? translate[state.language].outdoorSites : translate[state.language].outdoorSite
          }`}</div>
        )}
        <div part="outdoor-sites-list-container" class="outdoor-sites-list-container">
          {this.outdoorSitesToDisplay.map(outdoorSite => (
            <grw-outdoor-site-card
              outdoorSite={outdoorSite}
              exportparts="outdoor-site-card,outdoor-site-img-container,outdoor-site-img,outdoor-site-sub-container,outdoor-site-departure,outdoor-site-name,outdoor-site-themes-container,outdoor-site-theme,outdoor-site-icons-labels-container,outdoor-site-icon-label,outdoor-site-icon,outdoor-site-label"
              key={`outdoorSite-${outdoorSite.id}`}
              is-large-view={this.isLargeView}
              fontFamily={this.fontFamily}
              color-primary-app={this.colorPrimaryApp}
              color-on-surface={this.colorOnSurface}
              color-secondary-container={this.colorSecondaryContainer}
              color-on-secondary-container={this.colorOnSecondaryContainer}
              color-surface-container-low={this.colorSurfaceContainerLow}
            ></grw-outdoor-site-card>
          ))}
        </div>
        <div part="list-bottom-space" class={!this.isLargeView ? 'list-bottom-space' : 'list-large-view-bottom-space'}></div>
      </Host>
    );
  }
}
