import React from 'react';
import localization from '../../components/localization';

const RefinementOptionPublishers = (props) => {
  const {
    bemBlocks, onClick, active, itemKey,
    label
  } = props;
  let optionLabel;
  const toggleId = 'toggle-more-publishers';
  if (props.label === 'Ukjent') {
    optionLabel = props.label;
  }  else if(label === 'showmorelabel') {
    return (
      <label htmlFor={toggleId} >{localization.facet.showmore}</label>
    )
  } else if(label === 'showfewerlabel') {
    return (
      <label htmlFor={toggleId} >{localization.facet.showfewer}</label>
    )
  } else if(label === 'showmoreinput') {
    return (
      <input type="checkbox" id={toggleId}  />
    )
  } else {
    optionLabel = `${props.label.charAt(0)}${props.label.substring(1).toLowerCase()}`;
  }
  const id = encodeURIComponent((itemKey + Math.random()));
  const textLabel = localization.search_hit[optionLabel] ? localization.search_hit[optionLabel] : optionLabel;
  return (
    <div className="checkbox">
      {
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
      }<label onKeyPress={onClick} tabIndex="0" htmlFor={id} role="button">
        <input
          type="checkbox"
          id={id}
          tabIndex="-1"
          checked={active}
          onChange={onClick}
          className={`${bemBlocks.option().state({ active }).mix(bemBlocks.container('item'))
          } list-group-item fdk-label fdk-label-default`}
        />
        <label className="checkbox-replacement" htmlFor={id} />
        {textLabel} ({props.count})
      </label>
    </div>
  );
}

export default RefinementOptionPublishers;
