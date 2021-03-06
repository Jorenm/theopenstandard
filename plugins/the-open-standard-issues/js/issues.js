(function() {
    var facebookShareCount;
    var twitterShareCount;
    var googleplusShareCount;
    var shareUrl = window.shareUrl || window.location.href;

    function sharePopup(url, title, width, height) {
        var left = (screen.width / 2) - (width / 2);
        var top = (screen.height / 2) - (height / 2);
        var options = [
            'toolbar=0',
            'location=no',
            'directories=no',
            'status=no',
            'menubar=no',
            'scrollbars=no',
            'resizable=no',
            'copyhistory=no',
            'width=' + width,
            'height=' + height,
            'top=' + top,
            'left=' + left
        ];
        return window.open(url, title, options.join(','));
    } 

    function getShareCounts() {
        $.get('http://graph.facebook.com/?ids=' + shareUrl, function(response) {
            for (var url in response) facebookShareCount = response[url].shares;
            facebookShareCount = facebookShareCount || 0;
            shareCountReceived();
        });

        $.get('/share-counts?service=twitter&shared_url=' + encodeURIComponent(shareUrl), function(response) {
            twitterShareCount = response.count || 0;
            shareCountReceived();
        });

        $.get('/share-counts?service=googleplus&shared_url=' + encodeURIComponent(shareUrl), function(response) {
            googleplusShareCount = response.count || 0;
            shareCountReceived();
        });
    }

    function shareCountReceived() {
        if (twitterShareCount >= 0 && facebookShareCount >= 0 && googleplusShareCount >= 0) {
            var total = twitterShareCount + facebookShareCount + googleplusShareCount;
            $('.twitter').height((twitterShareCount / total * 100) || 0 + '%');
            $('.facebook').height((facebookShareCount / total * 100) || 0 + '%');
            $('.googleplus').height((googleplusShareCount / total * 100) || 0 + '%');
        }
    }

    function attachShareListeners() {
        $('button[data-share-service]').click(function() {
            var service = $(this).attr('data-share-service');
            var windowUrl = null;
            
            if (service == 'twitter')
                windowUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(document.title) + '&url=' + encodeURIComponent(shareUrl);
            if (service == 'facebook')
                windowUrl = 'http://www.facebook.com/sharer/sharer.php?u=#url'
            if (service == 'googleplus')
                windowUrl = 'https://plus.google.com/share?url=' + encodeURIComponent(shareUrl)
            
            if (windowUrl)
                sharePopup(windowUrl, 'Share this article', 500, 360);
            return false;
        });
    }

    attachShareListeners();
    getShareCounts();
})();