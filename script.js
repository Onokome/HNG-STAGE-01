document.addEventListener('DOMContentLoaded', function() {
    initializeTimeDisplay();
    initializeAvatarURLInput();
});


function initializeTimeDisplay() {
    const timeElement = document.querySelector('[data-testid="test-user-time"]');
    
    if (!timeElement) {
        console.error('Time element not found');
        return;
    }


    function updateTime() {
        const currentTime = Date.now();
        timeElement.textContent = currentTime;
        timeElement.setAttribute('aria-live', 'polite');
    }

    updateTime();

    setInterval(updateTime, 5000);
}


function initializeAvatarURLInput() {
    const avatarElement = document.querySelector('[data-testid="test-user-avatar"]');
    const urlInput = document.getElementById('avatar-url-input');
    const updateButton = document.getElementById('update-avatar');

    if (!avatarElement || !urlInput || !updateButton) {
        console.warn('Avatar URL input elements not found');
        return;
    }

    urlInput.addEventListener('input', function() {
        updateButton.disabled = !this.value.trim();
    });

    updateButton.addEventListener('click', updateAvatarFromURL);

    urlInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !updateButton.disabled) {
            updateAvatarFromURL();
        }
    });

    function updateAvatarFromURL() {
        const imageUrl = urlInput.value.trim();
        
        if (!imageUrl) {
            alert('Please enter an image URL');
            return;
        }

        updateButton.disabled = true;
        updateButton.textContent = 'Updating...';
        avatarElement.classList.add('avatar-loading');

     
        const testImage = new Image();
        
        testImage.onload = function() {
            avatarElement.src = imageUrl;
            avatarElement.alt = 'Updated profile picture';
            avatarElement.classList.remove('avatar-loading');
            updateButton.textContent = 'Update';
            updateButton.disabled = false;
            urlInput.value = '';
            
            urlInput.style.borderColor = '';
        };

        testImage.onerror = function() {
            alert('Failed to load image. Please check the URL and try again.');
            avatarElement.classList.remove('avatar-loading');
            updateButton.textContent = 'Update';
            updateButton.disabled = false;
            urlInput.style.borderColor = '#ef4444';
            urlInput.focus();
        };

        testImage.src = imageUrl;
        

        setTimeout(() => {
            if (!testImage.complete) {
                alert('Image loading is taking too long. Please check the URL or try a different image.');
                avatarElement.classList.remove('avatar-loading');
                updateButton.textContent = 'Update';
                updateButton.disabled = false;
            }
        }, 10000);
    }
}