(function () {
    const button = document.querySelector('.subscribe-toggle');
    const form = document.querySelector('#artifact-subscribe-form');
    const status = document.querySelector('.subscribe-status');

    if (!button || !form || !status) return;

    button.addEventListener('click', function () {
        const opening = form.hidden;
        form.hidden = !opening;
        button.setAttribute('aria-expanded', String(opening));
        if (opening) form.querySelector('input').focus();
    });

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        const email = new FormData(form).get('email').trim();
        status.textContent = 'Submitting…';
        submitButton.disabled = true;

        try {
            const response = await fetch('https://frgzcwsqbakawyrqegxj.supabase.co/functions/v1/subscribe-artifacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmcmd6Y3dzcWJha3d5cnFlZ3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5OTY4MjgsImV4cCI6MjEwMTU3MjgyOH0.gx7BkqFV604F-KclMAgaJ_c-s7Re9FFnlZoGs1PAVSI', Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmcmd6Y3dzcWJha3d5cnFlZ3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5OTY4MjgsImV4cCI6MjEwMTU3MjgyOH0.gx7BkqFV604F-KclMAgaJ_c-s7Re9FFnlZoGs1PAVSI' },
                body: JSON.stringify({ email })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Subscription failed. Please try again.');
            status.textContent = result.alreadySubscribed
                ? 'This email is already subscribed to artifact updates.'
                : 'Check your inbox for a confirmation email to finish subscribing.';
            form.reset();
        } catch (error) {
            status.textContent = error.message || 'Could not subscribe right now. Please try again later.';
        } finally {
            submitButton.disabled = false;
        }
    });
}());
