window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']]
    },
    options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
    },
};

document.addEventListener("DOMContentLoaded", function () {
    const siteNameElements = document.querySelectorAll('.site-name');
    siteNameElements.forEach(function (element) {
        const link = document.createElement('a');
        link.href = '/public-pages';
        link.innerHTML = element.innerHTML;
        link.style.textDecoration = 'none'; // Remove underline
        element.innerHTML = '';
        element.appendChild(link);
    });
});