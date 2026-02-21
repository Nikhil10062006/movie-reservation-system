import { useState, useEffect, lazy, Suspense } from "react";

const Navbar = lazy(() => import("../components,navbar.jsx"));

function MoviesIndividual() {
  return (
    <div>
      <header>
        <Suspense fallback={<p>Loading...</p>}>
          <Navbar />
        </Suspense>
      </header>
      <main>
        <div>
            <img src="" alt="Untitled"/>
            <button>Trailer</button>
            <></>
        </div>
      </main>
    </div>
  );
}
export default MoviesIndividual;
