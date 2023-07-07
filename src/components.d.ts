/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { InformationDesk, Poi, SensitiveArea, Trek } from "types/types";
export { InformationDesk, Poi, SensitiveArea, Trek } from "types/types";
export namespace Components {
    interface GrwApp {
        "api": string;
        "appHeight": string;
        "appWidth": string;
        "attribution": string;
        "center": string;
        "cities": string;
        "colorArrivalIcon": string;
        "colorBackground": string;
        "colorDepartureIcon": string;
        "colorOnPrimary": string;
        "colorOnPrimaryContainer": string;
        "colorOnSecondaryContainer": string;
        "colorOnSurface": string;
        "colorOnSurfaceVariant": string;
        "colorPoiIcon": string;
        "colorPrimaryApp": string;
        "colorPrimaryContainer": string;
        "colorSecondaryContainer": string;
        "colorSensitiveArea": string;
        "colorSurface": string;
        "colorSurfaceContainerHigh": string;
        "colorSurfaceContainerLow": string;
        "colorSurfaceVariant": string;
        "colorTrekLine": string;
        "districts": string;
        "fabBackgroundColor": string;
        "fabColor": string;
        "inBbox": string;
        "languages": string;
        "linkName": string;
        "linkTarget": string;
        "portals": string;
        "practices": string;
        "routes": string;
        "structures": string;
        "themes": string;
        "urlLayer": string;
        "weather": boolean;
        "zoom": number;
    }
    interface GrwFilter {
        "filterName": string;
        "filterNameProperty": string;
        "filterType": string;
    }
    interface GrwInformationDeskDetail {
        "informationDesk": InformationDesk;
    }
    interface GrwMap {
        "attribution": string;
        "center": string;
        "colorArrivalIcon": string;
        "colorBackground": string;
        "colorDepartureIcon": string;
        "colorOnPrimaryContainer": string;
        "colorOnSurface": string;
        "colorPoiIcon": string;
        "colorPrimaryApp": string;
        "colorPrimaryContainer": string;
        "colorSensitiveArea": string;
        "colorTrekLine": string;
        "isLargeView": boolean;
        "resetStoreOnDisconnected": boolean;
        "urlLayer": string;
        "zoom": number;
    }
    interface GrwPoiDetail {
        "poi": Poi;
    }
    interface GrwSelectLanguage {
    }
    interface GrwSensitiveAreaDetail {
        "sensitiveArea": SensitiveArea;
    }
    interface GrwTrekCard {
        "colorOnSecondaryContainer": string;
        "colorOnSurface": string;
        "colorPrimaryApp": string;
        "colorSecondaryContainer": string;
        "colorSurfaceContainerLow": string;
        "isLargeView": boolean;
        "resetStoreOnDisconnected": boolean;
        "trek": Trek;
    }
    interface GrwTrekDetail {
        "colorBackground": string;
        "colorOnPrimaryContainer": string;
        "colorOnSecondaryContainer": string;
        "colorOnSurface": string;
        "colorPrimaryApp": string;
        "colorPrimaryContainer": string;
        "colorSecondaryContainer": string;
        "isLargeView": boolean;
        "resetStoreOnDisconnected": boolean;
        "trek": Trek;
        "weather": boolean;
    }
    interface GrwTrekProvider {
        "api": string;
        "languages": string;
        "trekId": string;
    }
    interface GrwTreksList {
        "colorOnSecondaryContainer": string;
        "colorOnSurface": string;
        "colorPrimaryApp": string;
        "colorSecondaryContainer": string;
        "colorSurfaceContainerLow": string;
        "isLargeView": boolean;
        "resetStoreOnDisconnected": boolean;
    }
    interface GrwTreksProvider {
        "api": string;
        "cities": string;
        "districts": string;
        "inBbox": string;
        "languages": string;
        "portals": string;
        "practices": string;
        "routes": string;
        "structures": string;
        "themes": string;
    }
}
export interface GrwAppCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLGrwAppElement;
}
export interface GrwInformationDeskDetailCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLGrwInformationDeskDetailElement;
}
export interface GrwMapCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLGrwMapElement;
}
export interface GrwTrekCardCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLGrwTrekCardElement;
}
export interface GrwTrekDetailCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLGrwTrekDetailElement;
}
declare global {
    interface HTMLGrwAppElement extends Components.GrwApp, HTMLStencilElement {
    }
    var HTMLGrwAppElement: {
        prototype: HTMLGrwAppElement;
        new (): HTMLGrwAppElement;
    };
    interface HTMLGrwFilterElement extends Components.GrwFilter, HTMLStencilElement {
    }
    var HTMLGrwFilterElement: {
        prototype: HTMLGrwFilterElement;
        new (): HTMLGrwFilterElement;
    };
    interface HTMLGrwInformationDeskDetailElement extends Components.GrwInformationDeskDetail, HTMLStencilElement {
    }
    var HTMLGrwInformationDeskDetailElement: {
        prototype: HTMLGrwInformationDeskDetailElement;
        new (): HTMLGrwInformationDeskDetailElement;
    };
    interface HTMLGrwMapElement extends Components.GrwMap, HTMLStencilElement {
    }
    var HTMLGrwMapElement: {
        prototype: HTMLGrwMapElement;
        new (): HTMLGrwMapElement;
    };
    interface HTMLGrwPoiDetailElement extends Components.GrwPoiDetail, HTMLStencilElement {
    }
    var HTMLGrwPoiDetailElement: {
        prototype: HTMLGrwPoiDetailElement;
        new (): HTMLGrwPoiDetailElement;
    };
    interface HTMLGrwSelectLanguageElement extends Components.GrwSelectLanguage, HTMLStencilElement {
    }
    var HTMLGrwSelectLanguageElement: {
        prototype: HTMLGrwSelectLanguageElement;
        new (): HTMLGrwSelectLanguageElement;
    };
    interface HTMLGrwSensitiveAreaDetailElement extends Components.GrwSensitiveAreaDetail, HTMLStencilElement {
    }
    var HTMLGrwSensitiveAreaDetailElement: {
        prototype: HTMLGrwSensitiveAreaDetailElement;
        new (): HTMLGrwSensitiveAreaDetailElement;
    };
    interface HTMLGrwTrekCardElement extends Components.GrwTrekCard, HTMLStencilElement {
    }
    var HTMLGrwTrekCardElement: {
        prototype: HTMLGrwTrekCardElement;
        new (): HTMLGrwTrekCardElement;
    };
    interface HTMLGrwTrekDetailElement extends Components.GrwTrekDetail, HTMLStencilElement {
    }
    var HTMLGrwTrekDetailElement: {
        prototype: HTMLGrwTrekDetailElement;
        new (): HTMLGrwTrekDetailElement;
    };
    interface HTMLGrwTrekProviderElement extends Components.GrwTrekProvider, HTMLStencilElement {
    }
    var HTMLGrwTrekProviderElement: {
        prototype: HTMLGrwTrekProviderElement;
        new (): HTMLGrwTrekProviderElement;
    };
    interface HTMLGrwTreksListElement extends Components.GrwTreksList, HTMLStencilElement {
    }
    var HTMLGrwTreksListElement: {
        prototype: HTMLGrwTreksListElement;
        new (): HTMLGrwTreksListElement;
    };
    interface HTMLGrwTreksProviderElement extends Components.GrwTreksProvider, HTMLStencilElement {
    }
    var HTMLGrwTreksProviderElement: {
        prototype: HTMLGrwTreksProviderElement;
        new (): HTMLGrwTreksProviderElement;
    };
    interface HTMLElementTagNameMap {
        "grw-app": HTMLGrwAppElement;
        "grw-filter": HTMLGrwFilterElement;
        "grw-information-desk-detail": HTMLGrwInformationDeskDetailElement;
        "grw-map": HTMLGrwMapElement;
        "grw-poi-detail": HTMLGrwPoiDetailElement;
        "grw-select-language": HTMLGrwSelectLanguageElement;
        "grw-sensitive-area-detail": HTMLGrwSensitiveAreaDetailElement;
        "grw-trek-card": HTMLGrwTrekCardElement;
        "grw-trek-detail": HTMLGrwTrekDetailElement;
        "grw-trek-provider": HTMLGrwTrekProviderElement;
        "grw-treks-list": HTMLGrwTreksListElement;
        "grw-treks-provider": HTMLGrwTreksProviderElement;
    }
}
declare namespace LocalJSX {
    interface GrwApp {
        "api"?: string;
        "appHeight"?: string;
        "appWidth"?: string;
        "attribution"?: string;
        "center"?: string;
        "cities"?: string;
        "colorArrivalIcon"?: string;
        "colorBackground"?: string;
        "colorDepartureIcon"?: string;
        "colorOnPrimary"?: string;
        "colorOnPrimaryContainer"?: string;
        "colorOnSecondaryContainer"?: string;
        "colorOnSurface"?: string;
        "colorOnSurfaceVariant"?: string;
        "colorPoiIcon"?: string;
        "colorPrimaryApp"?: string;
        "colorPrimaryContainer"?: string;
        "colorSecondaryContainer"?: string;
        "colorSensitiveArea"?: string;
        "colorSurface"?: string;
        "colorSurfaceContainerHigh"?: string;
        "colorSurfaceContainerLow"?: string;
        "colorSurfaceVariant"?: string;
        "colorTrekLine"?: string;
        "districts"?: string;
        "fabBackgroundColor"?: string;
        "fabColor"?: string;
        "inBbox"?: string;
        "languages"?: string;
        "linkName"?: string;
        "linkTarget"?: string;
        "onResetFilter"?: (event: GrwAppCustomEvent<any>) => void;
        "portals"?: string;
        "practices"?: string;
        "routes"?: string;
        "structures"?: string;
        "themes"?: string;
        "urlLayer"?: string;
        "weather"?: boolean;
        "zoom"?: number;
    }
    interface GrwFilter {
        "filterName"?: string;
        "filterNameProperty"?: string;
        "filterType"?: string;
    }
    interface GrwInformationDeskDetail {
        "informationDesk"?: InformationDesk;
        "onCenterOnMap"?: (event: GrwInformationDeskDetailCustomEvent<{ latitude: number; longitude: number }>) => void;
    }
    interface GrwMap {
        "attribution"?: string;
        "center"?: string;
        "colorArrivalIcon"?: string;
        "colorBackground"?: string;
        "colorDepartureIcon"?: string;
        "colorOnPrimaryContainer"?: string;
        "colorOnSurface"?: string;
        "colorPoiIcon"?: string;
        "colorPrimaryApp"?: string;
        "colorPrimaryContainer"?: string;
        "colorSensitiveArea"?: string;
        "colorTrekLine"?: string;
        "isLargeView"?: boolean;
        "onTrekCardPress"?: (event: GrwMapCustomEvent<number>) => void;
        "resetStoreOnDisconnected"?: boolean;
        "urlLayer"?: string;
        "zoom"?: number;
    }
    interface GrwPoiDetail {
        "poi"?: Poi;
    }
    interface GrwSelectLanguage {
    }
    interface GrwSensitiveAreaDetail {
        "sensitiveArea"?: SensitiveArea;
    }
    interface GrwTrekCard {
        "colorOnSecondaryContainer"?: string;
        "colorOnSurface"?: string;
        "colorPrimaryApp"?: string;
        "colorSecondaryContainer"?: string;
        "colorSurfaceContainerLow"?: string;
        "isLargeView"?: boolean;
        "onTrekCardPress"?: (event: GrwTrekCardCustomEvent<number>) => void;
        "resetStoreOnDisconnected"?: boolean;
        "trek"?: Trek;
    }
    interface GrwTrekDetail {
        "colorBackground"?: string;
        "colorOnPrimaryContainer"?: string;
        "colorOnSecondaryContainer"?: string;
        "colorOnSurface"?: string;
        "colorPrimaryApp"?: string;
        "colorPrimaryContainer"?: string;
        "colorSecondaryContainer"?: string;
        "isLargeView"?: boolean;
        "onDescriptionReferenceIsInViewport"?: (event: GrwTrekDetailCustomEvent<boolean>) => void;
        "onInformationDeskIsInViewport"?: (event: GrwTrekDetailCustomEvent<boolean>) => void;
        "onParkingIsInViewport"?: (event: GrwTrekDetailCustomEvent<boolean>) => void;
        "onPoiIsInViewport"?: (event: GrwTrekDetailCustomEvent<boolean>) => void;
        "onSensitiveAreaIsInViewport"?: (event: GrwTrekDetailCustomEvent<boolean>) => void;
        "resetStoreOnDisconnected"?: boolean;
        "trek"?: Trek;
        "weather"?: boolean;
    }
    interface GrwTrekProvider {
        "api"?: string;
        "languages"?: string;
        "trekId"?: string;
    }
    interface GrwTreksList {
        "colorOnSecondaryContainer"?: string;
        "colorOnSurface"?: string;
        "colorPrimaryApp"?: string;
        "colorSecondaryContainer"?: string;
        "colorSurfaceContainerLow"?: string;
        "isLargeView"?: boolean;
        "resetStoreOnDisconnected"?: boolean;
    }
    interface GrwTreksProvider {
        "api"?: string;
        "cities"?: string;
        "districts"?: string;
        "inBbox"?: string;
        "languages"?: string;
        "portals"?: string;
        "practices"?: string;
        "routes"?: string;
        "structures"?: string;
        "themes"?: string;
    }
    interface IntrinsicElements {
        "grw-app": GrwApp;
        "grw-filter": GrwFilter;
        "grw-information-desk-detail": GrwInformationDeskDetail;
        "grw-map": GrwMap;
        "grw-poi-detail": GrwPoiDetail;
        "grw-select-language": GrwSelectLanguage;
        "grw-sensitive-area-detail": GrwSensitiveAreaDetail;
        "grw-trek-card": GrwTrekCard;
        "grw-trek-detail": GrwTrekDetail;
        "grw-trek-provider": GrwTrekProvider;
        "grw-treks-list": GrwTreksList;
        "grw-treks-provider": GrwTreksProvider;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "grw-app": LocalJSX.GrwApp & JSXBase.HTMLAttributes<HTMLGrwAppElement>;
            "grw-filter": LocalJSX.GrwFilter & JSXBase.HTMLAttributes<HTMLGrwFilterElement>;
            "grw-information-desk-detail": LocalJSX.GrwInformationDeskDetail & JSXBase.HTMLAttributes<HTMLGrwInformationDeskDetailElement>;
            "grw-map": LocalJSX.GrwMap & JSXBase.HTMLAttributes<HTMLGrwMapElement>;
            "grw-poi-detail": LocalJSX.GrwPoiDetail & JSXBase.HTMLAttributes<HTMLGrwPoiDetailElement>;
            "grw-select-language": LocalJSX.GrwSelectLanguage & JSXBase.HTMLAttributes<HTMLGrwSelectLanguageElement>;
            "grw-sensitive-area-detail": LocalJSX.GrwSensitiveAreaDetail & JSXBase.HTMLAttributes<HTMLGrwSensitiveAreaDetailElement>;
            "grw-trek-card": LocalJSX.GrwTrekCard & JSXBase.HTMLAttributes<HTMLGrwTrekCardElement>;
            "grw-trek-detail": LocalJSX.GrwTrekDetail & JSXBase.HTMLAttributes<HTMLGrwTrekDetailElement>;
            "grw-trek-provider": LocalJSX.GrwTrekProvider & JSXBase.HTMLAttributes<HTMLGrwTrekProviderElement>;
            "grw-treks-list": LocalJSX.GrwTreksList & JSXBase.HTMLAttributes<HTMLGrwTreksListElement>;
            "grw-treks-provider": LocalJSX.GrwTreksProvider & JSXBase.HTMLAttributes<HTMLGrwTreksProviderElement>;
        }
    }
}
