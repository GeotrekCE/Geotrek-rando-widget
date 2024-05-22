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
  outdoorSitesFilters,
  handleOutdoorSitesFiltersAndSearch,
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

  @Prop() fontFamily = 'Roboto';

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
    } else if (state.mode === 'outdoor') {
      return outdoorSitesFilters.filter(filter => filter.segment === segment).some(filter => state[filter.property] && state[filter.property].length > 0);
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

  handleEraseOutdoorSitesFilters() {
    outdoorSitesFilters.forEach(filter => {
      state[filter.property].forEach(currentFilter => (currentFilter.selected = false));
    });
    state.selectedActivitiesFilters = 0;
    state.selectedLocationFilters = 0;
    state.currentOutdoorSites = handleOutdoorSitesFiltersAndSearch();
    this.resetFilter.emit();
  }

  handleOkOutdoorSitesFilters() {
    this.handleFilters();
  }

  render() {
    return (
      <Host
        style={{
          '--font-family': this.fontFamily,
        }}
      >
        <div part="options-container" class="options-container">
          <div part="filters-container" class="filters-container">
            {state.mode === 'treks' && (
              <div part="filters-treks-container" class="filters-treks-container">
                <div part="filters-options-container" class="filters-options-container">
                  {state.treksWithinBounds && (
                    <div part="current-treks-within-bounds-length" class="current-treks-within-bounds-length">{`${state.treksWithinBounds.length} ${
                      state.treksWithinBounds.length > 1 ? translate[state.language].treks : translate[state.language].trek
                    }`}</div>
                  )}
                  <div part="filters-options-buttons-container" class="filters-options-buttons-container">
                    <button part="filter-option-button" class="filter-option-button" onClick={() => this.handleEraseTreksFilters()}>
                      {translate[state.language].erase}
                    </button>
                    <button part="filter-option-button" class="filter-option-button" onClick={() => this.handleOkTreksFilters()}>
                      {translate[state.language].ok}
                    </button>
                  </div>
                </div>
                <div part="segmented-buttons-container" class="segmented-buttons-container">
                  {this.handleSegment('selectedActivitiesFilters') && (
                    <label
                      part="segment"
                      class={`segment${this.selectedSegment === 'selectedActivitiesFilters' ? ' selected-segment' : ''}`}
                      onClick={() => this.handleSelectedSegment('selectedActivitiesFilters')}
                    >
                      {translate[state.language].home.segment.treks} {state.selectedActivitiesFilters !== 0 && `(${state.selectedActivitiesFilters})`}
                    </label>
                  )}
                  {this.handleSegment('selectedThemesFilters') && (
                    <label
                      part="segment"
                      class={`segment${this.selectedSegment === 'selectedThemesFilters' ? ' selected-segment' : ''}`}
                      onClick={() => this.handleSelectedSegment('selectedThemesFilters')}
                    >
                      {translate[state.language].themes} {state.selectedThemesFilters !== 0 && `(${state.selectedThemesFilters})`}
                    </label>
                  )}
                  {this.handleSegment('selectedLocationFilters') && (
                    <label
                      part="segment"
                      class={`segment${this.selectedSegment === 'selectedLocationFilters' ? ' selected-segment' : ''}`}
                      onClick={() => this.handleSelectedSegment('selectedLocationFilters')}
                    >
                      {translate[state.language].location} {state.selectedLocationFilters !== 0 && `(${state.selectedLocationFilters})`}
                    </label>
                  )}
                </div>
                <div part="filters-segment-container" class="filters-segment-container">
                  {this.selectedSegment === 'selectedActivitiesFilters' && (
                    <div part="segment-container" class="segment-container" key="treks-activities-segment-container">
                      {state['practices'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
                            filterName={translate[state.language].practice}
                            filterType="practices"
                            filterNameProperty="name"
                            segment="selectedActivitiesFilters"
                            filterPlaceholder={translate[state.language].placeholderPractices}
                          ></grw-filter>
                        </div>
                      )}
                      {state['difficulties'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
                            filterName={translate[state.language].difficulty}
                            filterType="difficulties"
                            filterNameProperty="label"
                            segment="selectedActivitiesFilters"
                            filterPlaceholder={translate[state.language].placeholderDifficulties}
                          ></grw-filter>
                        </div>
                      )}
                      {state['durations'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
                            filterName={translate[state.language].duration}
                            filterType="durations"
                            filterNameProperty="name"
                            segment="selectedActivitiesFilters"
                            filterPlaceholder={translate[state.language].placeholderDurations}
                          ></grw-filter>
                        </div>
                      )}
                      {state['lengths'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
                            filterName={translate[state.language].length}
                            filterType="lengths"
                            filterNameProperty="name"
                            segment="selectedActivitiesFilters"
                            filterPlaceholder={translate[state.language].placeholderLengths}
                          ></grw-filter>
                        </div>
                      )}
                      {state['elevations'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
                            filterName={translate[state.language].elevation}
                            filterType="elevations"
                            filterNameProperty="name"
                            segment="selectedActivitiesFilters"
                            filterPlaceholder={translate[state.language].placeholderElevations}
                          ></grw-filter>
                        </div>
                      )}
                      {state['routes'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
                            filterName={translate[state.language].routes}
                            filterType="routes"
                            filterNameProperty="route"
                            segment="selectedActivitiesFilters"
                            filterPlaceholder={translate[state.language].placeholderRoutes}
                          ></grw-filter>
                        </div>
                      )}
                      {state['accessibilities'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
                            filterName={translate[state.language].accessibility}
                            filterType="accessibilities"
                            filterNameProperty="name"
                            segment="selectedActivitiesFilters"
                            filterPlaceholder={translate[state.language].placeholderAccessibilities}
                          ></grw-filter>
                        </div>
                      )}
                      {state['labels'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
                            filterName={translate[state.language].activities}
                            filterType="labels"
                            filterNameProperty="name"
                            segment="selectedActivitiesFilters"
                            filterPlaceholder={translate[state.language].placeholderActivities}
                          ></grw-filter>
                        </div>
                      )}
                    </div>
                  )}
                  {this.selectedSegment === 'selectedThemesFilters' && (
                    <div part="filter-container" class="segment-container" key="treks-themes-segment-container">
                      {state['themes'].length > 0 && (
                        <div part="" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
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
                    <div part="segment-container" class="segment-container" key="treks-location-segment-container">
                      {state['districts'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
                            filterName={translate[state.language].districts}
                            filterType="districts"
                            filterNameProperty="name"
                            segment="selectedLocationFilters"
                            filterPlaceholder={translate[state.language].placeholderDistricts}
                          ></grw-filter>
                        </div>
                      )}
                      {state['cities'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
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
              <div part="filters-touristic-contents-container" class="filters-touristic-contents-container">
                <div part="filters-options-container" class="filters-options-container">
                  {state.touristicContentsWithinBounds && (
                    <div part="current-treks-within-bounds-length" class="current-treks-within-bounds-length">{`${state.touristicContentsWithinBounds.length} ${
                      state.touristicContentsWithinBounds.length > 1 ? translate[state.language].home.touristicContents : translate[state.language].home.touristicContent
                    }`}</div>
                  )}
                  <div part="filters-options-buttons-container" class="filters-options-buttons-container">
                    <button part="filter-option-button" class="filter-option-button" onClick={() => this.handleEraseTouristicContentsFilters()}>
                      {translate[state.language].erase}
                    </button>
                    <button part="filter-option-button" class="filter-option-button" onClick={() => this.handleOkTouristicContentsFilters()}>
                      {translate[state.language].ok}
                    </button>
                  </div>
                </div>
                <div part="segmented-buttons-container" class="segmented-buttons-container">
                  {this.handleSegment('selectedActivitiesFilters') && (
                    <label
                      part="segment"
                      class={`segment${this.selectedSegment === 'selectedActivitiesFilters' ? ' selected-segment' : ''}`}
                      onClick={() => this.handleSelectedSegment('selectedActivitiesFilters')}
                    >
                      {translate[state.language].services} {state.selectedActivitiesFilters !== 0 && `(${state.selectedActivitiesFilters})`}
                    </label>
                  )}
                  {this.handleSegment('selectedLocationFilters') && (
                    <label
                      part="segment"
                      class={`segment${this.selectedSegment === 'selectedLocationFilters' ? ' selected-segment' : ''}`}
                      onClick={() => this.handleSelectedSegment('selectedLocationFilters')}
                    >
                      {translate[state.language].location} {state.selectedLocationFilters !== 0 && `(${state.selectedLocationFilters})`}
                    </label>
                  )}
                </div>
                <div part="filters-segment-container" class="filters-segment-container">
                  {this.selectedSegment === 'selectedActivitiesFilters' && (
                    <div part="segment-container" class="segment-container" key="touristic-contents-activities-segment-container">
                      {state['touristicContentCategories'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
                            filterName={translate[state.language].category}
                            filterType="touristicContentCategories"
                            filterNameProperty="label"
                            segment="selectedActivitiesFilters"
                            filterPlaceholder={translate[state.language].placeholderCategories}
                          ></grw-filter>
                        </div>
                      )}
                    </div>
                  )}
                  {this.selectedSegment === 'selectedLocationFilters' && (
                    <div part="segment-container" class="segment-container" key="touristic-contents-location-segment-container">
                      {state['districts'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
                            filterName={translate[state.language].districts}
                            filterType="districts"
                            filterNameProperty="name"
                            segment="selectedLocationFilters"
                            filterPlaceholder={translate[state.language].placeholderDistricts}
                          ></grw-filter>
                        </div>
                      )}
                      {state['cities'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
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
              <div part="filters-touristic-events-container" class="filters-touristic-events-container">
                <div part="filters-options-container" class="filters-options-container">
                  {state.touristicEventsWithinBounds && (
                    <div part="current-treks-within-bounds-length" class="current-treks-within-bounds-length">{`${state.touristicEventsWithinBounds.length} ${
                      state.touristicEventsWithinBounds.length > 1 ? translate[state.language].home.touristicEvents : translate[state.language].home.touristicEvent
                    }`}</div>
                  )}
                  <div part="filters-options-buttons-container" class="filters-options-buttons-container">
                    <button part="filter-option-button" class="filter-option-button" onClick={() => this.handleEraseTouristicEventsFilters()}>
                      {translate[state.language].erase}
                    </button>
                    <button part="filter-option-button" class="filter-option-button" onClick={() => this.handleOkTouristicEventsFilters()}>
                      {translate[state.language].ok}
                    </button>
                  </div>
                </div>
                <div part="segmented-buttons-container" class="segmented-buttons-container">
                  {this.handleSegment('selectedActivitiesFilters') && (
                    <label
                      part="segment"
                      class={`segment${this.selectedSegment === 'selectedActivitiesFilters' ? ' selected-segment' : ''}`}
                      onClick={() => this.handleSelectedSegment('selectedActivitiesFilters')}
                    >
                      {translate[state.language].services} {state.selectedActivitiesFilters !== 0 && `(${state.selectedActivitiesFilters})`}
                    </label>
                  )}
                  {this.handleSegment('selectedLocationFilters') && (
                    <label
                      part="segment"
                      class={`segment${this.selectedSegment === 'selectedLocationFilters' ? ' selected-segment' : ''}`}
                      onClick={() => this.handleSelectedSegment('selectedLocationFilters')}
                    >
                      {translate[state.language].location} {state.selectedLocationFilters !== 0 && `(${state.selectedLocationFilters})`}
                    </label>
                  )}
                </div>
                <div part="filters-segment-container" class="filters-segment-container">
                  {this.selectedSegment === 'selectedActivitiesFilters' && (
                    <div part="segment-container" class="segment-container" key="touristic-contents-activities-segment-container">
                      {state['touristicEventTypes'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
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
                    <div part="segment-container" class="segment-container" key="touristic-events-location-segment-container">
                      {state['districts'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
                            filterName={translate[state.language].districts}
                            filterType="districts"
                            filterNameProperty="name"
                            segment="selectedLocationFilters"
                            filterPlaceholder={translate[state.language].placeholderDistricts}
                          ></grw-filter>
                        </div>
                      )}
                      {state['cities'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
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
            {state.mode === 'outdoor' && (
              <div part="filters-outdoor-sites-container" class="filters-outdoor-sites-container">
                <div part="filters-options-container" class="filters-options-container">
                  {state.outdoorSitesWithinBounds && (
                    <div part="current-treks-within-bounds-length" class="current-outdoor-sites-within-bounds-length">{`${state.outdoorSitesWithinBounds.length} ${
                      state.outdoorSitesWithinBounds.length > 1 ? translate[state.language].home.outdoorSites : translate[state.language].home.outdoorSite
                    }`}</div>
                  )}
                  <div part="filters-options-buttons-container" class="filters-options-buttons-container">
                    <button part="filter-option-button" class="filter-option-button" onClick={() => this.handleEraseOutdoorSitesFilters()}>
                      {translate[state.language].erase}
                    </button>
                    <button part="filter-option-button" class="filter-option-button" onClick={() => this.handleOkOutdoorSitesFilters()}>
                      {translate[state.language].ok}
                    </button>
                  </div>
                </div>
                <div part="segmented-buttons-container" class="segmented-buttons-container">
                  {this.handleSegment('selectedActivitiesFilters') && (
                    <label
                      part="segment"
                      class={`segment${this.selectedSegment === 'selectedActivitiesFilters' ? ' selected-segment' : ''}`}
                      onClick={() => this.handleSelectedSegment('selectedActivitiesFilters')}
                    >
                      {translate[state.language].home.segment.outdoorSites} {state.selectedActivitiesFilters !== 0 && `(${state.selectedActivitiesFilters})`}
                    </label>
                  )}
                  {this.handleSegment('selectedThemesFilters') && (
                    <label
                      part="segment"
                      class={`segment${this.selectedSegment === 'selectedThemesFilters' ? ' selected-segment' : ''}`}
                      onClick={() => this.handleSelectedSegment('selectedThemesFilters')}
                    >
                      {translate[state.language].themes} {state.selectedThemesFilters !== 0 && `(${state.selectedThemesFilters})`}
                    </label>
                  )}
                  {this.handleSegment('selectedLocationFilters') && (
                    <label
                      part="segment"
                      class={`segment${this.selectedSegment === 'selectedLocationFilters' ? ' selected-segment' : ''}`}
                      onClick={() => this.handleSelectedSegment('selectedLocationFilters')}
                    >
                      {translate[state.language].location} {state.selectedLocationFilters !== 0 && `(${state.selectedLocationFilters})`}
                    </label>
                  )}
                </div>
                <div part="filters-segment-container" class="filters-segment-container">
                  {this.selectedSegment === 'selectedActivitiesFilters' && (
                    <div part="segment-container" class="segment-container" key="touristic-contents-activities-segment-container">
                      {state['outdoorPractices'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
                            filterName={translate[state.language].practice}
                            filterPlaceholder={translate[state.language].placeholderPractices}
                            filterType="outdoorPractices"
                            filterNameProperty="name"
                            segment="selectedActivitiesFilters"
                          ></grw-filter>
                        </div>
                      )}
                      {state['outdoorSiteTypes'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
                            filterName={translate[state.language].activities}
                            filterType="outdoorSiteTypes"
                            filterNameProperty="name"
                            segment="selectedActivitiesFilters"
                            filterPlaceholder={translate[state.language].placeholderActivities}
                          ></grw-filter>
                        </div>
                      )}
                    </div>
                  )}
                  {this.selectedSegment === 'selectedThemesFilters' && (
                    <div part="filter-container" class="segment-container" key="treks-themes-segment-container">
                      {state['themes'].length > 0 && (
                        <div part="" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
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
                    <div part="segment-container" class="segment-container" key="outdoor-sites-location-segment-container">
                      {state['districts'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
                            filterName={translate[state.language].districts}
                            filterType="districts"
                            filterNameProperty="name"
                            segment="selectedLocationFilters"
                            filterPlaceholder={translate[state.language].placeholderDistricts}
                          ></grw-filter>
                        </div>
                      )}
                      {state['cities'].length > 0 && (
                        <div part="filter-container" class="filter-container">
                          <grw-filter
                            exportparts="filter-name,filter-button-container,filter-select,filter-button,elected-filter-icon,filter-label"
                            fontFamily={this.fontFamily}
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
          <div part="back-filters-container" class="back-filters-container" onClick={() => this.handleFilters()}></div>
        </div>
      </Host>
    );
  }
}
