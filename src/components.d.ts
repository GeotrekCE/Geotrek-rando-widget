/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { InformationDesk, Poi, SensitiveArea, Trek } from "types/types";
export namespace Components {
    interface GrwApp {
        "api": string;
        "attribution": string;
        "center": string;
        "cities": string;
        "colorArrivalIcon": string;
        "colorDepartureIcon": string;
        "colorPoiIcon": string;
        "colorPrimary": string;
        "colorPrimaryShade": string;
        "colorPrimaryTint": string;
        "colorSensitiveArea": string;
        "colorTrekLine": string;
        "districts": string;
        "inBbox": string;
        "language": string;
        "linkName": string;
        "linkTarget": string;
        "portals": string;
        "practices": string;
        "routes": string;
        "structures": string;
        "themes": string;
        "urlLayer": string;
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
        "colorDepartureIcon": string;
        "colorPoiIcon": string;
        "colorPrimary": string;
        "colorPrimaryTint": string;
        "colorSensitiveArea": string;
        "colorTrekLine": string;
        "resetStoreOnDisconnected": boolean;
        "urlLayer": string;
        "zoom": number;
    }
    interface GrwPoiDetail {
        "poi": Poi;
    }
    interface GrwSensitiveAreaDetail {
        "sensitiveArea": SensitiveArea;
    }
    interface GrwTrekCard {
        "colorPrimary": string;
        "colorPrimaryTint": string;
        "isLargeView": boolean;
        "resetStoreOnDisconnected": boolean;
        "trek": Trek;
    }
    interface GrwTrekDetail {
        "colorPrimary": string;
        "colorPrimaryShade": string;
        "colorPrimaryTint": string;
        "resetStoreOnDisconnected": boolean;
        "trek": Trek;
    }
    interface GrwTrekProvider {
        "api": string;
        "language": string;
        "trekId": string;
    }
    interface GrwTreksList {
        "colorPrimary": string;
        "colorPrimaryTint": string;
        "isLargeView": boolean;
        "resetStoreOnDisconnected": boolean;
    }
    interface GrwTreksProvider {
        "api": string;
        "cities": string;
        "districts": string;
        "inBbox": string;
        "language": string;
        "portals": string;
        "practices": string;
        "routes": string;
        "structures": string;
        "themes": string;
    }
}
export interface GrwMapCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLGrwMapElement;
}
export interface GrwTrekCardCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLGrwTrekCardElement;
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
        "attribution"?: string;
        "center"?: string;
        "cities"?: string;
        "colorArrivalIcon"?: string;
        "colorDepartureIcon"?: string;
        "colorPoiIcon"?: string;
        "colorPrimary"?: string;
        "colorPrimaryShade"?: string;
        "colorPrimaryTint"?: string;
        "colorSensitiveArea"?: string;
        "colorTrekLine"?: string;
        "districts"?: string;
        "inBbox"?: string;
        "language"?: string;
        "linkName"?: string;
        "linkTarget"?: string;
        "portals"?: string;
        "practices"?: string;
        "routes"?: string;
        "structures"?: string;
        "themes"?: string;
        "urlLayer"?: string;
        "zoom"?: number;
    }
    interface GrwFilter {
        "filterName"?: string;
        "filterNameProperty"?: string;
        "filterType"?: string;
    }
    interface GrwInformationDeskDetail {
        "informationDesk"?: InformationDesk;
    }
    interface GrwMap {
        "attribution"?: string;
        "center"?: string;
        "colorArrivalIcon"?: string;
        "colorDepartureIcon"?: string;
        "colorPoiIcon"?: string;
        "colorPrimary"?: string;
        "colorPrimaryTint"?: string;
        "colorSensitiveArea"?: string;
        "colorTrekLine"?: string;
        "onTrekCardPress"?: (event: GrwMapCustomEvent<number>) => void;
        "resetStoreOnDisconnected"?: boolean;
        "urlLayer"?: string;
        "zoom"?: number;
    }
    interface GrwPoiDetail {
        "poi"?: Poi;
    }
    interface GrwSensitiveAreaDetail {
        "sensitiveArea"?: SensitiveArea;
    }
    interface GrwTrekCard {
        "colorPrimary"?: string;
        "colorPrimaryTint"?: string;
        "isLargeView"?: boolean;
        "onTrekCardPress"?: (event: GrwTrekCardCustomEvent<number>) => void;
        "resetStoreOnDisconnected"?: boolean;
        "trek"?: Trek;
    }
    interface GrwTrekDetail {
        "colorPrimary"?: string;
        "colorPrimaryShade"?: string;
        "colorPrimaryTint"?: string;
        "resetStoreOnDisconnected"?: boolean;
        "trek"?: Trek;
    }
    interface GrwTrekProvider {
        "api"?: string;
        "language"?: string;
        "trekId"?: string;
    }
    interface GrwTreksList {
        "colorPrimary"?: string;
        "colorPrimaryTint"?: string;
        "isLargeView"?: boolean;
        "resetStoreOnDisconnected"?: boolean;
    }
    interface GrwTreksProvider {
        "api"?: string;
        "cities"?: string;
        "districts"?: string;
        "inBbox"?: string;
        "language"?: string;
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
            "grw-sensitive-area-detail": LocalJSX.GrwSensitiveAreaDetail & JSXBase.HTMLAttributes<HTMLGrwSensitiveAreaDetailElement>;
            "grw-trek-card": LocalJSX.GrwTrekCard & JSXBase.HTMLAttributes<HTMLGrwTrekCardElement>;
            "grw-trek-detail": LocalJSX.GrwTrekDetail & JSXBase.HTMLAttributes<HTMLGrwTrekDetailElement>;
            "grw-trek-provider": LocalJSX.GrwTrekProvider & JSXBase.HTMLAttributes<HTMLGrwTrekProviderElement>;
            "grw-treks-list": LocalJSX.GrwTreksList & JSXBase.HTMLAttributes<HTMLGrwTreksListElement>;
            "grw-treks-provider": LocalJSX.GrwTreksProvider & JSXBase.HTMLAttributes<HTMLGrwTreksProviderElement>;
        }
    }
}
