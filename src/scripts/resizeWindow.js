// Attempt to open a new tab with iPhone 13/14 dimensions
function openInMobileView() {
    const width = 390;
    const height = 844;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    window.open(
      window.location.href,
      '_blank',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  }
  
  // Run on page load (for prototyping, you may want to trigger this manually)
  // if (!window.location.search.includes('opened')) {
  //   openInMobileView();
  //   window.location.search += '&opened=true';
  // }