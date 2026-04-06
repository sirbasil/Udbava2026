document.addEventListener('DOMContentLoaded', () => {

    // 1. Live Search
    const searchInput = document.getElementById('inventory-search');
    const searchResults = document.getElementById('search-results');

    if (searchInput && searchResults) {
        let debounceTimer;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            const query = e.target.value.trim();

            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }

            debounceTimer = setTimeout(() => {
                fetch(`/api/inventory/search?q=${encodeURIComponent(query)}`)
                    .then(res => res.json())
                    .then(data => {
                        searchResults.innerHTML = '';
                        if (data.length > 0) {
                            data.forEach(item => {
                                const div = document.createElement('div');
                                div.className = 'rs-item d-flex justify-content-between align-items-center';
                                div.innerHTML = `
                                    <span class="rs-name">${item.name} <br> <small class="text-secondary" style="font-family: Inter;">${item.category}</small></span>
                                    <span class="price-text" style="font-size: 1rem;">$${item.price.toFixed(2)}</span>
                                `;
                                searchResults.appendChild(div);
                            });
                            searchResults.style.display = 'block';
                        } else {
                            searchResults.innerHTML = '<div class="rs-item"><span class="text-secondary">No items found</span></div>';
                            searchResults.style.display = 'block';
                        }
                    })
                    .catch(err => console.error(err));
            }, 300);
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    // 2. Notification Subscription
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Subscribed ✓';
            btn.classList.replace('btn-gold', 'btn-outline-gold');
            setTimeout(() => {
                btn.innerText = originalText;
                btn.classList.replace('btn-outline-gold', 'btn-gold');
                e.target.reset();
            }, 3000);
        });
    }

    // 3. Manager Inline Stock Edit
    const updateBtns = document.querySelectorAll('.update-stock-btn');
    updateBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const input = document.querySelector(`input.stock-edit[data-id="${id}"]`);
            const newValue = parseInt(input.value);

            if (!isNaN(newValue)) {
                const originalText = e.target.innerText;
                e.target.innerText = '...';

                fetch('/api/manager/stock', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id, count: newValue })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        e.target.innerText = 'Saved!';
                        e.target.classList.add('btn-gold');
                        e.target.classList.remove('btn-outline-gold');
                        setTimeout(() => {
                            e.target.innerText = originalText;
                            e.target.classList.remove('btn-gold');
                            e.target.classList.add('btn-outline-gold');
                        }, 2000);
                    }
                })
                .catch(err => {
                    console.error(err);
                    e.target.innerText = 'Error';
                });
            }
        });
    });

});
