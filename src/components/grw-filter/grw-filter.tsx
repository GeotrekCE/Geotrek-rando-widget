import { Component, Host, h, Prop, Listen, forceUpdate, Element } from '@stencil/core';
import state from 'store/store';
import {
  treksFilters,
  handleTreksFiltersAndSearch,
  touristicContentsFilters,
  handleTouristicContentsFiltersAndSearch,
  touristicEventsFilters,
  handleTouristicEventsFiltersAndSearch,
} from 'utils/utils';
import 'choices.js/public/assets/scripts/choices.min.js';

@Component({
  tag: 'grw-filter',
  styleUrl: 'grw-filter.scss',
  shadow: true,
})
export class GrwFilter {
  @Element() el: HTMLElement;
  filterRef: HTMLElement;
  choicesRef: HTMLElement;
  choices: any;

  @Prop() fontFamily = 'Roboto';

  @Prop() filterType: string;
  @Prop() filterName: string;
  @Prop() filterPlaceholder: string = '';
  @Prop() filterNameProperty: string;
  @Prop() segment: string;

  @Listen('resetFilter', { target: 'window' })
  onResetFilter() {
    this.resetFilter();
  }

  handleFilter(_event: MouseEvent, filterToHandle: any) {
    const filterFromState = [...state[this.filterType]];
    filterFromState.find(currentFilter => currentFilter.id === filterToHandle.id).selected = !filterFromState.find(currentFilter => currentFilter.id === filterToHandle.id)
      .selected;
    state[this.filterType] = filterFromState;

    state[this.segment] = 0;

    if (state.mode === 'treks') {
      treksFilters
        .filter(filter => filter.segment === this.segment)
        .forEach(filter => {
          state[this.segment] += state[filter.property].filter(filter => filter.selected).length;
        });

      state.currentTreks = handleTreksFiltersAndSearch();
    } else if (state.mode === 'touristicContents') {
      touristicContentsFilters
        .filter(filter => filter.segment === this.segment)
        .forEach(filter => {
          state[this.segment] += state[filter.property].filter(filter => filter.selected).length;
        });

      state.currentTouristicContents = handleTouristicContentsFiltersAndSearch();
    } else if (state.mode === 'touristicEvents') {
      touristicEventsFilters
        .filter(filter => filter.segment === this.segment)
        .forEach(filter => {
          state[this.segment] += state[filter.property].filter(filter => filter.selected).length;
        });

      state.currentTouristicEvents = handleTouristicEventsFiltersAndSearch();
    }
  }

  resetFilter() {
    if (this.choices) {
      this.choices.removeActiveItems();
    }
    forceUpdate(this.filterRef);
  }

  componentDidLoad() {
    if (this.choicesRef) {
      // @ts-ignore
      this.choices = new Choices(this.choicesRef, {
        removeItemButton: true,
        choices: state[this.filterType].map(currentFilter => {
          return { value: currentFilter.id, label: currentFilter[this.filterNameProperty], selected: currentFilter.selected };
        }),
        placeholder: true,
        placeholderValue: this.filterPlaceholder,
        noResultsText: '',
        noChoicesText: '',
        itemSelectText: '',
      });

      const choices = this.el.shadowRoot.querySelector('.choices');
      choices.addEventListener(
        'click',
        event => {
          event.stopPropagation();
          const dropdown = this.el.shadowRoot.querySelector('.choices__list.choices__list--dropdown');
          if (!dropdown.classList.contains('is-active')) {
            const choices = this.el.shadowRoot.querySelector('.choices');
            choices.classList.add('is-focused');
            choices.classList.add('is-open');
            dropdown.classList.add('is-active');
            dropdown.setAttribute('aria-expanded', 'true');
          }
        },
        false,
      );
      choices.addEventListener(
        'change',
        event => {
          this.handleFilter(
            null,
            state[this.filterType].find(currentFilter => currentFilter.id === (event as any).detail.value),
          );
        },
        false,
      );
    }
  }

  render() {
    return (
      <Host
        ref={el => (this.filterRef = el)}
        style={{
          '--font-family': this.fontFamily,
        }}
      >
        <div part="filter-name" class="filter-name display-large">{this.filterName}</div>
        <div part="filter-button-container" class="filter-button-container">
          {state[this.filterType].length > 9 ? (
            <select part="filter-select" multiple ref={el => (this.choicesRef = el)}></select>
          ) : (
            state[this.filterType]
              .filter(currentFilter => !currentFilter.hasOwnProperty('filter') || (currentFilter.hasOwnProperty('filter') && currentFilter.filter))
              .map(currentFilter => (
                <button part="filter-button" class={currentFilter.selected ? 'filter-button selected-filter-button' : 'filter-button'} onClick={event => this.handleFilter(event, currentFilter)}>
                  {/* @ts-ignore */}
                  {currentFilter.selected && (<span  part="selected-filter-icon"  class="material-symbols material-symbols-outlined icon" translate={false}>
                      check
                    </span>
                  )}
                  <span part="filter-label" class="filter-label">
                    {currentFilter[this.filterNameProperty]}
                  </span>
                </button>
              ))
          )}
        </div>
      </Host>
    );
  }
}
