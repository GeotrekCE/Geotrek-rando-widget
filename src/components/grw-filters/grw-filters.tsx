import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { translate } from 'i18n/i18n';
import state from 'store/store';
import { filters, handleFiltersAndSearch } from 'utils/utils';

@Component({
  tag: 'grw-filters',
  styleUrl: 'grw-filters.scss',
  shadow: true,
})
export class GrwFilters {
  @Event() resetFilter: EventEmitter;

  @State() selectedSegment = 'selectedActivitiesFilters';

  @Prop() handleFilters: Function;

  handleEraseFilters() {
    filters.forEach(filter => {
      state[filter.property].forEach(currentFilter => (currentFilter.selected = false));
    });
    state.selectedActivitiesFilters = 0;
    state.selectedThemesFilters = 0;
    state.selectedLocationFilters = 0;
    state.currentTreks = handleFiltersAndSearch();
    this.resetFilter.emit();
  }

  handleSelectedSegment(selectedSegment) {
    this.selectedSegment = selectedSegment;
  }

  handleSegment(segment) {
    return filters.filter(filter => filter.segment === segment).some(filter => state[filter.property] && state[filter.property].length > 0);
  }

  handleOkFilters() {
    this.handleFilters();
  }

  render() {
    return (
      <Host>
        <div class="options-container">
          <div class="filters-container">
            <div class="filters-options-container">
              {state.treksWithinBounds && (
                <div class="current-treks-within-bounds-length">{`${state.treksWithinBounds.length} ${
                  state.treksWithinBounds.length > 1 ? translate[state.language].treks : translate[state.language].trek
                }`}</div>
              )}
              <div class="filters-options-buttons-container">
                <button class="filter-option-button" onClick={() => this.handleEraseFilters()}>
                  {translate[state.language].erase}
                </button>
                <button class="filter-option-button" onClick={() => this.handleOkFilters()}>
                  {translate[state.language].ok}
                </button>
              </div>
            </div>
            <div class="segmented-buttons-container">
              {this.handleSegment('selectedActivitiesFilters') && (
                <label
                  class={`segment${this.selectedSegment === 'selectedActivitiesFilters' ? ' selected-segment' : ''}`}
                  onClick={() => this.handleSelectedSegment('selectedActivitiesFilters')}
                >
                  {translate[state.language].activities} {state.selectedActivitiesFilters !== 0 && `(${state.selectedActivitiesFilters})`}
                </label>
              )}
              {this.handleSegment('selectedThemesFilters') && (
                <label
                  class={`segment${this.selectedSegment === 'selectedThemesFilters' ? ' selected-segment' : ''}`}
                  onClick={() => this.handleSelectedSegment('selectedThemesFilters')}
                >
                  {translate[state.language].themes} {state.selectedThemesFilters !== 0 && `(${state.selectedThemesFilters})`}
                </label>
              )}
              {this.handleSegment('selectedLocationFilters') && (
                <label
                  class={`segment${this.selectedSegment === 'selectedLocationFilters' ? ' selected-segment' : ''}`}
                  onClick={() => this.handleSelectedSegment('selectedLocationFilters')}
                >
                  {translate[state.language].location} {state.selectedLocationFilters !== 0 && `(${state.selectedLocationFilters})`}
                </label>
              )}
            </div>
            <div class="filters-segment-container">
              {this.selectedSegment === 'selectedActivitiesFilters' && (
                <div class="segment-container">
                  {state['practices'].length > 0 && (
                    <div class="filter-container">
                      <grw-filter filterName={translate[state.language].practice} filterType="practices" filterNameProperty="name" segment="selectedActivitiesFilters"></grw-filter>
                    </div>
                  )}
                  {state['difficulties'].length > 0 && (
                    <div class="filter-container">
                      <grw-filter
                        filterName={translate[state.language].difficulty}
                        filterType="difficulties"
                        filterNameProperty="label"
                        segment="selectedActivitiesFilters"
                      ></grw-filter>
                    </div>
                  )}
                  {state['durations'].length > 0 && (
                    <div class="filter-container">
                      <grw-filter filterName={translate[state.language].duration} filterType="durations" filterNameProperty="name" segment="selectedActivitiesFilters"></grw-filter>
                    </div>
                  )}
                  {state['lengths'].length > 0 && (
                    <div class="filter-container">
                      <grw-filter filterName={translate[state.language].length} filterType="lengths" filterNameProperty="name" segment="selectedActivitiesFilters"></grw-filter>
                    </div>
                  )}
                  {state['elevations'].length > 0 && (
                    <div class="filter-container">
                      <grw-filter
                        filterName={translate[state.language].elevation}
                        filterType="elevations"
                        filterNameProperty="name"
                        segment="selectedActivitiesFilters"
                      ></grw-filter>
                    </div>
                  )}
                  {state['routes'].length > 0 && (
                    <div class="filter-container">
                      <grw-filter filterName={translate[state.language].routes} filterType="routes" filterNameProperty="route" segment="selectedActivitiesFilters"></grw-filter>
                    </div>
                  )}
                  {state['accessibilities'].length > 0 && (
                    <div class="filter-container">
                      <grw-filter
                        filterName={translate[state.language].accessibility}
                        filterType="accessibilities"
                        filterNameProperty="name"
                        segment="selectedActivitiesFilters"
                      ></grw-filter>
                    </div>
                  )}
                  {state['labels'].length > 0 && (
                    <div class="filter-container">
                      <grw-filter filterName={translate[state.language].activities} filterType="labels" filterNameProperty="name" segment="selectedActivitiesFilters"></grw-filter>
                    </div>
                  )}
                </div>
              )}
              {this.selectedSegment === 'selectedThemesFilters' && (
                <div class="segment-container">
                  {state['themes'].length > 0 && (
                    <div class="filter-container">
                      <grw-filter filterName={translate[state.language].themes} filterType="themes" filterNameProperty="label" segment="selectedThemesFilters"></grw-filter>
                    </div>
                  )}
                </div>
              )}
              {this.selectedSegment === 'selectedLocationFilters' && (
                <div class="segment-container">
                  {state['districts'].length > 0 && (
                    <div class="filter-container">
                      <grw-filter filterName={translate[state.language].districts} filterType="districts" filterNameProperty="name" segment="selectedLocationFilters"></grw-filter>
                    </div>
                  )}
                  {state['cities'].length > 0 && (
                    <div class="filter-container">
                      <grw-filter filterName={translate[state.language].cities} filterType="cities" filterNameProperty="name" segment="selectedLocationFilters"></grw-filter>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div onClick={() => this.handleFilters()} class="back-filters-container"></div>
        </div>
      </Host>
    );
  }
}
