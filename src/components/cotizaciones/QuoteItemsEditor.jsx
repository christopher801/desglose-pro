import { formatMoney, uid } from "../../utils/cotizaciones/quoteFormatters";

const blank = () => ({
  id: uid(),
  description: "",
  details: "",
  quantity: 1,
  unit: "Unidad",
  unitPrice: 0,
  discount: 0,
  total: 0,
});

const units = [
  "Unidad",
  "Metro",
  "Metro cuadrado",
  "Pie",
  "Servicio",
  "Global",
];

export default function QuoteItemsEditor({ items = [], onChange }) {
  const safeItems = Array.isArray(items) ? items : [];

  const patch = (id, field, value) => {
    const updated = safeItems.map((item) => {
      if (item.id !== id) return item;

      const next = { ...item, [field]: value };

      const quantity = Math.max(0, Number(next.quantity) || 0);
      const unitPrice = Math.max(0, Number(next.unitPrice) || 0);
      const discount = Math.max(0, Number(next.discount) || 0);

      next.total = Math.max(0, quantity * unitPrice - discount);

      return next;
    });

    onChange(updated);
  };

  const move = (index, direction) => {
    const target = index + direction;

    if (target < 0 || target >= safeItems.length) return;

    const updated = [...safeItems];

    [updated[index], updated[target]] = [
      updated[target],
      updated[index],
    ];

    onChange(updated);
  };

  const duplicate = (index) => {
    const original = safeItems[index];

    const copy = {
      ...original,
      id: uid(),
    };

    const updated = [
      ...safeItems.slice(0, index + 1),
      copy,
      ...safeItems.slice(index + 1),
    ];

    onChange(updated);
  };

  const remove = (id) => {
    onChange(safeItems.filter((item) => item.id !== id));
  };

  return (
    <div className="quote-items">
      <div className="quote-items-heading">
        <div>
          <h3>Productos y servicios</h3>
          <span>
            {safeItems.length} {safeItems.length === 1 ? "concepto" : "conceptos"}
          </span>
        </div>

        <button
          type="button"
          className="btn-primary-sm"
          onClick={() => onChange([...safeItems, blank()])}
        >
          <i className="bi bi-plus-lg" />
          <span>Agregar concepto</span>
        </button>
      </div>

      <div className="quote-items-list">
        {safeItems.map((item, index) => {
          const quantity = Math.max(0, Number(item.quantity) || 0);
          const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
          const discount = Math.max(0, Number(item.discount) || 0);

          const total = Math.max(
            0,
            quantity * unitPrice - discount
          );

          return (
            <article className="quote-item" key={item.id}>
              <div className="quote-item-top">
                <strong>Concepto {index + 1}</strong>

                <div className="quote-item-actions">
                  <button
                    type="button"
                    className="btn btn-light"
                    title="Subir"
                    aria-label="Subir concepto"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <i className="bi bi-arrow-up" />
                  </button>

                  <button
                    type="button"
                    className="btn btn-light"
                    title="Bajar"
                    aria-label="Bajar concepto"
                    disabled={index === safeItems.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <i className="bi bi-arrow-down" />
                  </button>

                  <button
                    type="button"
                    className="btn btn-light"
                    title="Duplicar"
                    aria-label="Duplicar concepto"
                    onClick={() => duplicate(index)}
                  >
                    <i className="bi bi-copy" />
                  </button>

                  <button
                    type="button"
                    className="btn btn-light text-danger"
                    title="Eliminar"
                    aria-label="Eliminar concepto"
                    onClick={() => remove(item.id)}
                  >
                    <i className="bi bi-trash" />
                  </button>
                </div>
              </div>

              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label">Descripción</label>

                  <input
                    type="text"
                    className="form-control"
                    value={item.description || ""}
                    onChange={(event) =>
                      patch(item.id, "description", event.target.value)
                    }
                    placeholder="Ej. Ventana corrediza"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Detalles (opcional)</label>

                  <input
                    type="text"
                    className="form-control"
                    value={item.details || ""}
                    onChange={(event) =>
                      patch(item.id, "details", event.target.value)
                    }
                    placeholder="Medidas, material, color..."
                  />
                </div>

                <div className="col-6 col-md-2">
                  <label className="form-label">Cantidad</label>

                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    className="form-control"
                    value={item.quantity ?? 1}
                    onChange={(event) =>
                      patch(item.id, "quantity", event.target.value)
                    }
                  />
                </div>

                <div className="col-6 col-md-2">
                  <label className="form-label">Unidad</label>

                  <select
                    className="form-select"
                    value={item.unit || "Unidad"}
                    onChange={(event) =>
                      patch(item.id, "unit", event.target.value)
                    }
                  >
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-6 col-md-3">
                  <label className="form-label">Precio unitario</label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control"
                    value={item.unitPrice ?? 0}
                    onChange={(event) =>
                      patch(item.id, "unitPrice", event.target.value)
                    }
                  />
                </div>

                <div className="col-6 col-md-2">
                  <label className="form-label">Descuento</label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control"
                    value={item.discount ?? 0}
                    onChange={(event) =>
                      patch(item.id, "discount", event.target.value)
                    }
                  />
                </div>

                <div className="col-md-3 d-flex align-items-end">
                  <div className="quote-item-total">
                    <span>Importe</span>
                    <strong>{formatMoney(total)}</strong>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {!safeItems.length && (
        <div className="quote-items-empty">
          <i className="bi bi-receipt" />
          <strong>Sin conceptos</strong>
          <span>Agrega productos o servicios a esta cotización.</span>
        </div>
      )}
    </div>
  );
}