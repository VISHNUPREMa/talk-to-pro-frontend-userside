// sw.js

self.addEventListener('push', function(event) {
    console.log('Push event received'); // Check if the push event is triggered
  
    if (event.data) {
      console.log('Push data:', event.data.text()); // Check the data received
  
      try {
        const data = event.data.json();
        console.log('Notification data:', data); // Log the parsed data
  
        const options = {
          body: data.body,
    
        };
  
        event.waitUntil(
          self.registration.showNotification(data.title, options)
        );
        console.log('Notification shown');
      } catch (e) {
        console.error('Error parsing push data:', e);
      }
    } else {
      console.error('No data in push event');
    }
  });
  

 
  