const PaletteCell = (instrumentName:string, onClickFunc:any, border:string) => {
    return (
      <td key={instrumentName}>
        <div className="table-palette-buttonframe">
          <button
            className="button-palette"
            role="button"
            style={{border: border}}
            onClick={(e) => onClickFunc(instrumentName, e.target)}
          >
            {instrumentName}
          </button>
        </div>
      </td>
    );
};

export default PaletteCell;