import type { CSSProperties } from "react";

export default function Hobby() {
  return (
    <div className="page-stack">
      <section className="surface-card reveal">
        <h1 className="section-title">Hobby</h1>
        <p className="section-subtitle">
          Activities that keep me focused, strategic, and continuously learning.
        </p>
      </section>

      <section className="hobby-grid">
        <article
          className="surface-card hobby-card stagger"
          style={{ "--delay": "70ms" } as CSSProperties}
        >
          <h2>Chess</h2>
          <p className="lede">~1800 rated player on Lichess.</p>
        </article>

        <article
          className="surface-card hobby-card stagger"
          style={{ "--delay": "140ms" } as CSSProperties}
        >
          <h2>Favorite Books</h2>
          <ul className="book-list">
            <li>The Art of War - Sun Tzu</li>
            <li>Rich Dad Poor Dad - Robert Kiyosaki</li>
            <li>Who Will Cry When You Die - Robin Sharma</li>
            <li>Attitude Is Everything - Jeff Keller</li>
            <li>Man&apos;s Search for Meaning - Viktor Frankl</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
