<div>
  <span>Sort</span>
  <span>Filter</span>
</div>

<style>
  div {
    background-color: var(--c-white);
    padding: var(--p-medium);
    display: flex;
    flex-direction: column;
    min-width: 10rem;
    align-items: start;
    border-radius: var(--p-medium);
    font-weight: bold;
  }

  span {
    display: flex;
    align-items: center;
    gap: 1ch;
  }

  span::before {
    content: "";
    display: block;
    width: 0.5rem;
    aspect-ratio: 1 / 1;
    border-radius: 100%;
    background-color: var(--c-gray);
  }
</style>
