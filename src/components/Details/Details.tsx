import { useMemo, useState } from "react";
import type { Book } from "../../api/reading";
import css from "./Details.module.css";
import Icon from "../Icon/Icon";
import { deleteReading } from "../../api/reading";
import { toast } from "react-toastify";

type Props = {
  book: Book;
  onBookUpdate: (book: Book) => void;
};

function minutesBetween(a: string, b: string) {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(0, Math.round(ms / 60000));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("uk-UA");
}

export function Details({ book, onBookUpdate }: Props) {
  const [view, setView] = useState<"diary" | "statistics">("diary");

  const events = useMemo(() => {
    return book.progress
      .filter((p) => p.status === "inactive" && p.finishPage !== null && p.finishReading !== null)
      .map((p) => {
        const pagesRead = (p.finishPage as number) - p.startPage + 1;
        const minutes = minutesBetween(
          p.startReading,
          p.finishReading as string,
        );
        const percent = (pagesRead / book.totalPages) * 100;

        return {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          id: (p as any)._id,
          date: formatDate(p.startReading),
          pagesRead,
          minutes,
          percent,
          speed: p.speed ?? 0,
        };
      });
  }, [book]);

  const totalPagesRead = useMemo(() => {
    return events.reduce((sum, e) => sum + e.pagesRead, 0);
  }, [events]);

  const totalPercent = useMemo(() => {
    return book.totalPages ? (totalPagesRead / book.totalPages) * 100 : 0;
  }, [totalPagesRead, book.totalPages]);

  async function handleDelete(readingId: string) {
    try {
      const updated = await deleteReading({ bookId: book._id, readingId });
      onBookUpdate(updated);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? err?.message ?? "Delete failed",
      );
    }
  }

  return (
    <div className={css.container}>
      <div className={css.window}>
        <div className={css.header}>
          <h3 className={css.title}>
            {view === "diary" ? "Diary" : "Statistics"}
          </h3>
          <div className={css.switch}>
            <button
              type="button"
              onClick={() => setView("diary")}
              className={css.button}
            >
              <Icon
                name="time"
                className={view === "statistics" ? css.deactive : css.icon}
                width={16}
                height={16}
              />
            </button>
            <button
              type="button"
              onClick={() => setView("statistics")}
              className={css.button}
            >
              <Icon
                name="pie"
                className={view === "diary" ? css.deactive : css.icon}
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>

{view === "diary" ? (
  <div className={css.cont}>
    {events.length === 0 ? (
      <div className={css.empty}>
        <div className={css.circle}>
            <span className={css.emojii}>🌟</span>
        </div>
        <p className={css.emptyTitle}>No reading records yet</p>
        <p className={css.emptyText}>Press <span className={css.span}>'To stop'</span> to save your first reading session.</p>
      </div>
    ) : (
      <ul className={css.list}>
        {events.map((e) => (
          <li key={e.id} className={css.item}>
            <div className={css.left}>
              <div className={css.dateRow}>
                <span className={css.checkbox}></span>
                <span className={css.date}>{e.date}</span>
              </div>
              <div className={css.percent}>{e.percent.toFixed(1)}%</div>
              <div className={css.minutes}>{e.minutes} minutes</div>
            </div>
            <div className={css.right}>
              <div className={css.pages}>{e.pagesRead} pages</div>
              <div
                className={css.bar}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                style={{ ["--fill" as any]: `${Math.min(100, Math.max(0, e.percent))}%` }}
              />
              <div className={css.speed}>{e.speed} pages <br /> per hour</div>
              <button
                className={css.trash}
                type="button"
                onClick={() => handleDelete(e.id)}
                aria-label="Delete"
              >
                <Icon name="trash" width={16} height={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
) : (
  <div className={css.cont}>
    <div className={css.statistics}>

    </div>
  </div>
)}
      </div>
    </div>
  );
}
