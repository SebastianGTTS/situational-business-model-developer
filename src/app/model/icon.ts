import { DatabaseModelPart } from '../database/database-model-part';
import { Equality } from '../shared/equality';
import { DatabaseEntry, DatabaseInit } from '../database/database-entry';

export enum IconTypes {
  PREDEFINED,
  CUSTOM,
}

export interface IconInit extends DatabaseInit {
  type?: IconTypes;
  color?: string;
  icon?: string;
  image?: string;
  altText?: string;
}

export interface IconEntry extends DatabaseEntry {
  type: IconTypes;
  color: string;
  icon: string;
  image?: string;
  altText?: string;
}

export class Icon implements IconInit, Equality<Icon>, DatabaseModelPart {
  type: IconTypes = IconTypes.PREDEFINED;
  color = 'dark';
  icon = 'bi-asterisk';
  image?: string;
  altText?: string;

  constructor(entry: IconEntry | undefined, init: IconInit | undefined) {
    const element = entry ?? init;
    if (element == null) {
      throw new Error('Either entry or init must be provided.');
    }
    this.type = element.type ?? this.type;
    this.color = element.color ?? this.color;
    this.icon = element.icon ?? this.icon;
    this.image = element.image;
    this.altText = element.altText;
  }

  update(icon: IconInit): void {
    this.type = icon.type ?? this.type;
    this.color = icon.color ?? this.color;
    this.icon = icon.icon ?? this.icon;
    this.image = icon.image;
    this.altText = icon.altText;
  }

  toDb(): IconEntry {
    return {
      type: this.type,
      color: this.color,
      icon: this.icon,
      image: this.image,
      altText: this.altText,
    };
  }

  equals(other: Icon): boolean {
    if (other == null) {
      return false;
    }
    return false;
  }
}
