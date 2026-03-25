const statusElement = document.getElementById('status');
const checkoutButtons = document.querySelectorAll('.checkout-btn');

const setStatus = (message) => {
  statusElement.textContent = message;
};

checkoutButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const plan = button.dataset.plan;
    setStatus(`Preparing secure Stripe checkout for ${plan} plan...`);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to start checkout.');
      }

      if (!data.url) {
        throw new Error('Missing checkout URL from server.');
      }

      window.location.assign(data.url);
    } catch (error) {
      setStatus(error.message);
    }
  });
});

const searchParams = new URLSearchParams(window.location.search);
if (searchParams.get('canceled') === 'true') {
  setStatus('Checkout canceled. You can restart anytime.');
}

document.getElementById('year').textContent = new Date().getFullYear();
