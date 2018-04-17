import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import localization from '../../components/localization';
import {
  getTranslateText,
  getLanguageFromUrl
} from '../../utils/translateText';
import './index.scss';

const renderPublisher = source => {
  const { creator } = source;
  if (creator && creator.name) {
    return (
      <span className="inline-block fdk-strong-virksomhet">
        <span className="uu-invisible" aria-hidden="false">
          Utgiver.
        </span>
        {creator.name}
      </span>
    );
  }
  return null;
};

const renderThemes = source => {
  const { inScheme } = source;
  const children = items =>
    items.map((item, index) => {
      const subItem = item.substring(item.lastIndexOf('/') + 1);
      return (
        <span
          key={`dataset-description-inScheme-${index}`}
          id={`dataset-description-inScheme-${index}`}
          className="fdk-label"
        >
          <span className="uu-invisible" aria-hidden="false">
            Tema.
          </span>
          {subItem}
        </span>
      );
    });
  if (inScheme) {
    return <div className="mt-3">{children(inScheme)}</div>;
  }
  return null;
};

const renderLaw = _source => {
  const { source } = _source;
  if (source) {
    return (
      <div>
        <span className="fa-stack fdk-fa-left fdk-fa-circle">
          <i className="fa fa-file-text fa-stack-1x fdk-color0" />
        </span>
        <a title="Link til lovhjemmel for begrep" href={source}>
          <span className="uu-invisible" aria-hidden="false">
            Link til lovhjemmel for begrep.
          </span>
          {source}
          <i className="fa fa-external-link fdk-fa-right" />
        </a>
      </div>
    );
  }
  return null;
};

const renderNote = (source, selectedLanguageCode) => {
  const { note } = source;
  if (note) {
    return (
      <p className="fdk-p-search-hit">
        {getTranslateText(note, selectedLanguageCode)}
      </p>
    );
  }
  return null;
};

const renderAltLabel = (source, selectedLanguageCode) => {
  const { altLabel } = source;
  const children = items =>
    items.map((item, index) => {
      if (index > 0) {
        return (
          <span key={`concepts-altlabel-${index}`}>
            {`, ${getTranslateText(item, selectedLanguageCode)}`}
          </span>
        );
      }
      return (
        <span key={`concepts-altlabel-${index}`}>
          {`${getTranslateText(item, selectedLanguageCode)}`}
        </span>
      );
    });
  if (altLabel) {
    return (
      <p>
        <span className="uu-invisible" aria-hidden="false">
          Begrep er
        </span>
        <strong>{localization.terms.altLabel} </strong>
        {children(altLabel)}
      </p>
    );
  }
  return null;
};

const renderDocCount = (result, selectedLanguageCode) => {
  const { _source } = result;
  const lang = getLanguageFromUrl();
  let langParam = '';
  if (lang) {
    langParam = `&lang=${lang}`;
  }
  const subjectCountItem = _source.datasets ? _source.datasets.length : 0;
  if (subjectCountItem > 0 && _source.prefLabel) {
    return (
      <p>
        <a
          className="fdk-hit-dataset-count"
          title="Link til datasett med begrep"
          href={`/?subject=${getTranslateText(
            _source.prefLabel,
            selectedLanguageCode
          )}${langParam}`}
        >
          {localization.terms.docCount} {subjectCountItem}{' '}
          {localization.terms.docCountPart2}
        </a>
      </p>
    );
  }
  return null;
};

const ConceptsHitItem = props => {
  const { onAddTerm, selectedLanguageCode } = props;
  const { _source } = props.result;
  const { prefLabel, definition, uri } = _source;
  const hitElementId = `concepts-hit-${encodeURIComponent(uri)}`;

  let termTitle;
  let termDescription;

  if (prefLabel) {
    termTitle = getTranslateText(prefLabel, selectedLanguageCode);
    termTitle =
      termTitle.charAt(0).toUpperCase() + termTitle.substring(1).toLowerCase();
  }
  if (definition) {
    termDescription = getTranslateText(definition, selectedLanguageCode);
  }

  let toBeCompared = false;
  if (props.terms) {
    toBeCompared = _.some(props.terms, term => term.uri === uri);
  }

  return (
    <div
      id={hitElementId}
      className="fdk-a-search-hit"
      title={`Begrep: ${termTitle}`}
      tabIndex="0" // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
    >
      <span className="uu-invisible" aria-hidden="false">
        Søketreff begrep.
      </span>
      <div
        className={`fdk-container-search-hit ${toBeCompared
          ? 'toBeCompared'
          : ''}`}
      >
        {!toBeCompared && (
          <button
            className="fdk-button fdk-button-default pull-right mt-3 visible-md visible-lg"
            onClick={() => {
              onAddTerm(_source);
            }}
            type="button"
          >
            <span aria-hidden="true">+</span> {localization.compare.addCompare}
          </button>
        )}

        {!toBeCompared && (
          <button
            className="fdk-button fdk-button-default fdk-btn-compare visible-xs visible-sm"
            onClick={() => {
              onAddTerm(_source);
            }}
            type="button"
          >
            <span aria-hidden="true">+</span> {localization.compare.addCompare}
          </button>
        )}

        <span className="uu-invisible" aria-hidden="false">
          Tittel.
        </span>
        <h2 className="inline-block mr-2">{termTitle}</h2>

        {renderPublisher(_source)}

        {renderThemes(_source)}

        <p className="fdk-p-search-hit">
          <span className="uu-invisible" aria-hidden="false">
            Beskrivelse av begrep.
          </span>
          {termDescription}
        </p>

        {renderLaw(_source)}

        <hr />

        {renderNote(_source, selectedLanguageCode)}

        {renderAltLabel(_source, selectedLanguageCode)}

        {renderDocCount(props.result)}
      </div>
    </div>
  );
};

ConceptsHitItem.defaultProps = {
  result: null,
  terms: null,
  selectedLanguageCode: 'nb'
};

ConceptsHitItem.propTypes = {
  result: PropTypes.shape({}),
  terms: PropTypes.array,
  onAddTerm: PropTypes.func.isRequired,
  selectedLanguageCode: PropTypes.string
};

export default ConceptsHitItem;
