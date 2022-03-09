const PaletteCell = (instrumentName:string, onClickFunc:any) => {
    return (
      <td>
        <div className="table-palette-buttonframe">
          <button
            className="button-palette"
            role="button"
            onClick={() => onClickFunc(instrumentName)}
          >
            {instrumentName}
          </button>
        </div>
      </td>
    );
};

export default PaletteCell;