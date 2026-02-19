import { memo } from "react";
const Options = memo(function Options({
  children,
  onShow,
  expanded,
  contents,
  setSelectedFilters,
}) {
  return (
    <div>
      <button
        aria-expanded={expanded}
        aria-controls={children}
        onClick={onShow}
        type="button"
      >
        {children}
      </button>
      {expanded && (
        <div>
          <ul id={children}>
            {contents.map((content) => (
              <li key={content}>
                <button
                  onClick={() => {
                    setSelectedFilters((prevFilters) => {
                      const alreadySelected =
                        prevFilters[children].includes(content);
                      if (alreadySelected) {
                        return {
                          ...prevFilters,
                          [children]: prevFilters[children].filter(
                            (item) => item !== content,
                          ),
                        };
                      } else {
                        return {
                          ...prevFilters,
                          [children]: [...prevFilters[children], content],
                        };
                      }
                    });
                  }}
                >
                  {content}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

export default Options;
