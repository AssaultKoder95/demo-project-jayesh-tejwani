import _ from 'lodash';
import React from 'react';
import { Label } from 'semantic-ui-react';
function ShowLabelGroup({ labels }) {
  const validLabelColors = ['teal', 'blue', 'red', 'green', 'orange', 'purple', 'violet'];

  return (
    <>
      {labels.map((label, index) => (
        <Label color={validLabelColors[index]} key={index} size="small">
          {_.capitalize(label)}
        </Label>
      ))}
    </>
  );
}

export default ShowLabelGroup;
