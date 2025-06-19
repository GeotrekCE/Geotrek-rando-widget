import { Component, Host, h, State, Prop, Listen, Element } from '@stencil/core';
import { translate } from 'i18n/i18n';
import state from 'store/store';

@Component({
  tag: 'grw-toggle-slot-visibility',
  styleUrl: 'grw-toggle-slot-visibility.scss',
  shadow: false,
})
export class GrwToggleSlotVisibility {
  @Element() toggleSlotElement: HTMLElement;
  @State() isLargeView = undefined;
  @State() showStartSlot = true;
  @State() showEndSlot = false;

  @Prop() largeViewSize = 1024;
  @Prop() fontFamily = 'Roboto';
  @Prop() fabBackgroundColor = '#eaddff';
  @Prop() fabColor = '#21005d';
  @Prop() slotEndHeight = '100vh';

  @Listen('resize', { target: 'window' })
  onWindowResize() {
    this.handleView();
  }

  handleView() {
    if (typeof this.isLargeView === undefined || this.isLargeView !== this.toggleSlotElement.getBoundingClientRect().width >= this.largeViewSize) {
      this.isLargeView = this.toggleSlotElement.getBoundingClientRect().width >= this.largeViewSize;
      this.showStartSlot = true;
      this.showEndSlot = this.isLargeView;
      if (!this.isLargeView) {
        const mapVisibilityIcon = this.getMapVisibilityIconButton();
        const mapVisibilityButtonContainer = document.createElement('div');
        mapVisibilityButtonContainer.className = `grw-map-visibility-button-container ${mapVisibilityIcon === 'map' ? 'extended-fab-map' : 'extended-fab-detail'}`;
        const mapVisibilityButton = document.createElement('grw-extended-fab');
        mapVisibilityButton.setAttribute('exportparts', 'map-visibility-button,map-visibility-button-icon,map-visibility-button-label');
        mapVisibilityButton.setAttribute('font-family', this.fontFamily);
        mapVisibilityButton.action = () => this.toggleShowSlot();
        mapVisibilityButton.icon = () => mapVisibilityIcon;
        mapVisibilityButton.name = () => this.getMapVisibilityLabelButton();
        mapVisibilityButton.setAttribute('fab-background-color', this.fabBackgroundColor);
        mapVisibilityButton.setAttribute('fab-color', this.fabColor);

        mapVisibilityButton.setAttribute('display', this.isLargeView ? 'none' : 'flex');
        mapVisibilityButtonContainer.append(mapVisibilityButton);
        document.body.append(mapVisibilityButtonContainer);

        const slotEnd: any = document.querySelector('#grw-slot-end-container');

        const slotEndClone = slotEnd.cloneNode(true);
        slotEndClone.id = 'grw-slot-end-container-clone';
        slotEndClone.style.visibility = 'hidden';
        slotEndClone.style.position = 'fixed';
        slotEndClone.style.top = '0px';
        slotEndClone.style.left = '0px';
        slotEndClone.style['z-index'] = '0';
        slotEndClone.style.height = '100vh';
        slotEndClone.style['background-color'] = '#ffffff';
        document.body.append(slotEndClone);
      } else {
        const mapVisibilityButtonContainer = document.body.getElementsByClassName('grw-map-visibility-button-container')[0];
        if (mapVisibilityButtonContainer) {
          mapVisibilityButtonContainer.remove();
        }
        const slotEndClone = document.body.querySelector('#grw-slot-end-container-clone');
        if (slotEndClone) {
          slotEndClone.remove();
        }
      }
    }
  }

  toggleShowSlot() {
    this.showStartSlot = !this.showStartSlot;
    this.showEndSlot = !this.showStartSlot;
    const grwSlotEndContainerClone: any = document.querySelector('#grw-slot-end-container-clone');
    if (grwSlotEndContainerClone && this.showEndSlot) {
      grwSlotEndContainerClone.style.visibility = 'visible';
      document.body.style.overflow = `hidden`;
      grwSlotEndContainerClone.style['z-index'] = '4000';
    } else {
      grwSlotEndContainerClone.style.visibility = 'hidden';
      document.body.style.overflow = `visible`;
      grwSlotEndContainerClone.style['z-index'] = '0';
    }

    const mapVisibilityButtonContainer = document.body.getElementsByClassName('grw-map-visibility-button-container')[0];
    const grwExtendedFab: any = document.getElementsByTagName('grw-extended-fab')[0];
    const mapVisibilityIcon = this.getMapVisibilityIconButton();
    mapVisibilityButtonContainer.className = `grw-map-visibility-button-container ${mapVisibilityIcon === 'map' ? 'extended-fab-map' : 'extended-fab-detail'}`;
    grwExtendedFab.icon = () => mapVisibilityIcon;
    grwExtendedFab.name = () => this.getMapVisibilityLabelButton();
  }

  componentDidRender() {
    this.handleView();
  }

  getMapVisibilityIconButton() {
    let mapIconButton: string;
    mapIconButton = this.showStartSlot ? 'map' : 'summarize';
    return mapIconButton;
  }

  getMapVisibilityLabelButton() {
    let mapLabelButton: string;
    mapLabelButton = this.showStartSlot ? translate[state.language].showMap : translate[state.language].showDetails;
    return mapLabelButton;
  }

  render() {
    return (
      <Host>
        <div class="grw-toggle-slot-visibility-container">
          <div
            class="grw-slot-start-container"
            style={{ height: this.showStartSlot ? '100%' : '100vh', visibility: this.showStartSlot ? 'visible' : 'hidden', zIndex: this.showStartSlot ? '1' : '0' }}
          >
            <slot name="start"> </slot>
          </div>

          <div
            id="grw-slot-end-container"
            style={{
              width: '100%',
              height: this.slotEndHeight,
              visibility: !this.isLargeView ? 'hidden' : 'visible',
              position: !this.isLargeView ? 'absolute' : 'relative',
              top: !this.isLargeView ? '0px' : 'none',
              left: !this.isLargeView ? '0px' : 'none',
              zIndex: !this.isLargeView ? '0' : '1',
            }}
          >
            <slot name="end"> </slot>
          </div>
        </div>
      </Host>
    );
  }
}
