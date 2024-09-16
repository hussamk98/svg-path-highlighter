/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import SVGPathHighlighterWrapper from './SVGPathHighlighterWrapper';
import './app.css';

const App = () => {
  const [selectedPaths, setSelectedPaths] = useState({ front: [], back: [] });
  const groupsFront = { group1: ['1', '2'] };
  const groupsBack = { group1: ['1', '2'] };

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <SVGPathHighlighterWrapper
        selectedPaths={selectedPaths.front}
        setSelectedPaths={(paths: any) =>
          setSelectedPaths((prev) => ({ ...prev, front: paths }))
        }
        config="HumanBodyFront"
        groups={groupsFront}
      />
      <SVGPathHighlighterWrapper
        selectedPaths={selectedPaths.back}
        setSelectedPaths={(paths: any) =>
          setSelectedPaths((prev) => ({ ...prev, back: paths }))
        }
        config="HumanBodyBack"
        groups={groupsBack}
      />
      <div className="json-container">
        <pre>
          <code>{JSON.stringify(selectedPaths, null, 4)}</code>
        </pre>
      </div>
    </div>
  );
};

export default App;
