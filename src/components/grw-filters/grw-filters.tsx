import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { translate } from 'i18n/i18n';
import state from 'store/store';
import {
  treksFilters,
  handleTreksFiltersAndSearch,
  touristicContentsFilters,
  handleTouristicContentsFiltersAndSearch,
  handleTouristicEventsFiltersAndSearch,
  touristicEventsFilters,
} from 'utils/utils';

@Component({
  tag: 'grw-filters',
  styleUrl: 'grw-filters.scss',
  shadow: true,
})
export class GrwFilters {
  @Event() resetFilter: EventEmitter;

  @State() selectedSegment = 'selectedActivitiesFilters';

  @Prop() handleFilters: Function;

  handleEraseTreksFilters() {
    treksFilters.forEach(filter => {
      state[filter.property].forEach(currentFilter => (currentFilter.selected = false));
    });
    state.selectedActivitiesFilters = 0;
    state.selectedThemesFilters = 0;
    state.selectedLocationFilters = 0;
    state.currentTreks = handleTreksFiltersAndSearch();
    this.resetFilter.emit();
  }

  handleOkTreksFilters() {
    this.handleFilters();
  }

  handleSelectedSegment(selectedSegment) {
    this.selectedSegment = selectedSegment;
  }

  handleSegment(segment) {
    if (state.mode === 'treks') {
      return treksFilters.filter(filter => filter.segment === segment).some(filter => state[filter.property] && state[filter.property].length > 0);
    } else if (state.mode === 'touristicContents') {
      return touristicContentsFilters.filter(filter => filter.segment === segment).some(filter => state[filter.property] && state[filter.property].length > 0);
    } else if (state.mode === 'touristicEvents') {
      return touristicEventsFilters.filter(filter => filter.segment === segment).some(filter => state[filter.property] && state[filter.property].length > 0);
    }
  }

  handleEraseTouristicContentsFilters() {
    touristicContentsFilters.forEach(filter => {
      state[filter.property].forEach(currentFilter => (currentFilter.selected = false));
    });
    state.selectedActivitiesFilters = 0;
    state.selectedLocationFilters = 0;
    state.currentTouristicContents = handleTouristicContentsFiltersAndSearch();
    this.resetFilter.emit();
  }

  handleOkTouristicContentsFilters() {
    this.handleFilters();
  }

  handleEraseTouristicEventsFilters() {
    touristicEventsFilters.forEach(filter => {
      state[filter.property].forEach(currentFilter => (currentFilter.selected = false));
    });
    state.selectedActivitiesFilters = 0;
    state.selectedLocationFilters = 0;
    state.currentTouristicEvents = handleTouristicEventsFiltersAndSearch();
    this.resetFilter.emit();
  }

  handleOkTouristicEventsFilters() {
    this.handleFilters();
  }

  render() {
    return (
      <Host>
        <div class="options-container">
          <div class="filters-container">
            {state.mode === 'treks' && (
              <div class="filters-treks-container">
                <div class="filters-options-container">
                  {state.treksWithinBounds && (
                    <div class="current-treks-within-bounds-length">{`${state.treksWithinBounds.length} ${
                      state.treksWithinBounds.length > 1 ? translate[state.language].treks : translate[state.language].trek
                    }`}</div>
                  )}
                  <div class="filters-options-buttons-container">
                    <button class="filter-option-button" onClick={() => this.handleEraseTreksFilters()}>
                      {translate[state.language].erase}
                    </button>
                    <button class="filter-option-button" onClick={() => this.handleOkTreksFilters()}>
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
                    <div key="treks-activities-segment-container" class="segment-container">
                      {state['practices'].length > 0 && (
                        <div class="filter-container">
                          <grw-filter
                            filterName={translate[state.language].practice}
                            filterType="practices"
                            filterNameProperty="name"
                            segment="selectedActivitiesFilters"
                            filterPlaceholder={translate[state.language].placeholderPractices}
                          ></grw-filter>
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
                          <grw-filter
                            filterName={translate[state.language].duration}
                            filterType="durations"
                            filterNameProperty="name"
                            segment="selectedActivitiesFilters"
                          ></grw-filter>
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
                          <grw-filter
                            filterName={translate[state.language].activities}
                            filterType="labels"
                            filterNameProperty="name"
                            segment="selectedActivitiesFilters"
                          ></grw-filter>
                        </div>
                      )}
                    </div>
                  )}
                  {this.selectedSegment === 'selectedThemesFilters' && (
                    <div key="treks-themes-segment-container" class="segment-container">
                      {state['themes'].length > 0 && (
                        <div class="filter-container">
                          <grw-filter
                            filterName={translate[state.language].themes}
                            filterPlaceholder={translate[state.language].placeholderThemes}
                            filterType="themes"
                            filterNameProperty="label"
                            segment="selectedThemesFilters"
                          ></grw-filter>
                        </div>
                      )}
                    </div>
                  )}
                  {this.selectedSegment === 'selectedLocationFilters' && (
                    <div key="treks-location-segment-container" class="segment-container">
                      {state['districts'].length > 0 && (
                        <div class="filter-container">
                          <grw-filter
                            filterName={translate[state.language].districts}
                            filterType="districts"
                            filterNameProperty="name"
                            segment="selectedLocationFilters"
                          ></grw-filter>
                        </div>
                      )}
                      {state['cities'].length > 0 && (
                        <div class="filter-container">
                          <grw-filter
                            filterName={translate[state.language].crossedCities}
                            filterPlaceholder={translate[state.language].placeholderCrossedCities}
                            filterType="cities"
                            filterNameProperty="name"
                            segment="selectedLocationFilters"
                          ></grw-filter>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            {state.mode === 'touristicContents' && (
              <div class="filters-touristic-contents-container">
                <div class="filters-options-container">
                  {state.touristicContentsWithinBounds && (
                    <div class="current-treks-within-bounds-length">{`${state.touristicContentsWithinBounds.length} ${
                      state.touristicContentsWithinBounds.length > 1 ? translate[state.language].home.touristicContents : translate[state.language].home.touristicContent
                    }`}</div>
                  )}
                  <div class="filters-options-buttons-container">
                    <button class="filter-option-button" onClick={() => this.handleEraseTouristicContentsFilters()}>
                      {translate[state.language].erase}
                    </button>
                    <button class="filter-option-button" onClick={() => this.handleOkTouristicContentsFilters()}>
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
                      {translate[state.language].services} {state.selectedActivitiesFilters !== 0 && `(${state.selectedActivitiesFilters})`}
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
                    <div key="touristic-contents-activities-segment-container" class="segment-container">
                      {state['touristicContentCategories'].length > 0 && (
                        <div class="filter-container">
                          <grw-filter
                            filterName={translate[state.language].category}
                            filterType="touristicContentCategories"
                            filterNameProperty="label"
                            segment="selectedActivitiesFilters"
                          ></grw-filter>
                        </div>
                      )}
                    </div>
                  )}
                  {this.selectedSegment === 'selectedLocationFilters' && (
                    <div key="touristic-contents-location-segment-container" class="segment-container">
                      {state['districts'].length > 0 && (
                        <div class="filter-container">
                          <grw-filter
                            filterName={translate[state.language].districts}
                            filterType="districts"
                            filterNameProperty="name"
                            segment="selectedLocationFilters"
                          ></grw-filter>
                        </div>
                      )}
                      {state['cities'].length > 0 && (
                        <div class="filter-container">
                          <grw-filter
                            filterName={translate[state.language].crossedCities}
                            filterPlaceholder={translate[state.language].placeholderCrossedCities}
                            filterType="cities"
                            filterNameProperty="name"
                            segment="selectedLocationFilters"
                          ></grw-filter>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            {state.mode === 'touristicEvents' && (
              <div class="filters-touristic-events-container">
                <div class="filters-options-container">
                  {state.touristicEventsWithinBounds && (
                    <div class="current-treks-within-bounds-length">{`${state.touristicEventsWithinBounds.length} ${
                      state.touristicEventsWithinBounds.length > 1 ? translate[state.language].home.touristicEvents : translate[state.language].home.touristicEvent
                    }`}</div>
                  )}
                  <div class="filters-options-buttons-container">
                    <button class="filter-option-button" onClick={() => this.handleEraseTouristicEventsFilters()}>
                      {translate[state.language].erase}
                    </button>
                    <button class="filter-option-button" onClick={() => this.handleOkTouristicEventsFilters()}>
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
                      {translate[state.language].services} {state.selectedActivitiesFilters !== 0 && `(${state.selectedActivitiesFilters})`}
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
                    <div key="touristic-contents-activities-segment-container" class="segment-container">
                      {state['touristicEventTypes'].length > 0 && (
                        <div class="filter-container">
                          <grw-filter
                            filterName={translate[state.language].type}
                            filterPlaceholder={translate[state.language].placeholderType}
                            filterType="touristicEventTypes"
                            filterNameProperty="type"
                            segment="selectedActivitiesFilters"
                          ></grw-filter>
                        </div>
                      )}
                    </div>
                  )}
                  {this.selectedSegment === 'selectedLocationFilters' && (
                    <div key="touristic-events-location-segment-container" class="segment-container">
                      {state['districts'].length > 0 && (
                        <div class="filter-container">
                          <grw-filter
                            filterName={translate[state.language].districts}
                            filterType="districts"
                            filterNameProperty="name"
                            segment="selectedLocationFilters"
                          ></grw-filter>
                        </div>
                      )}
                      {state['cities'].length > 0 && (
                        <div class="filter-container">
                          <grw-filter
                            filterName={translate[state.language].crossedCities}
                            filterPlaceholder={translate[state.language].placeholderCrossedCities}
                            filterType="cities"
                            filterNameProperty="name"
                            segment="selectedLocationFilters"
                          ></grw-filter>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div onClick={() => this.handleFilters()} class="back-filters-container"></div>
        </div>
      </Host>
    );
  }
}
