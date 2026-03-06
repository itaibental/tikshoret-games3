// concepts-loader.js - מאחד את כל חלקי המושגים

// טוען את כל החלקים ומאחד אותם
(function() {
    // המתן שכל הסקריפטים ייטענו
    window.addEventListener('DOMContentLoaded', function() {
        // איחוד כל החלקים לאובייקט אחד
        window.conceptsData = {
            ...(window.conceptsPart1 || {}),
            ...(window.conceptsPart2 || {}),
            ...(window.conceptsPart3 || {}),
            ...(window.conceptsPart4 || {})
        };
        
        console.log('✅ נטענו', Object.keys(window.conceptsData).length, 'מושגים');
    });
})();
