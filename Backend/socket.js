const socketIo = require('socket.io');
const userModel = require('./models/user.model'); 
const captainModel = require('./models/captain.model');

let io ;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

    socket.on("join" , async(data) => {
      const{userId , userType} = data;
      console.log(`[SOCKET] User ${userId} joined as ${userType} with socketId ${socket.id}`);

      if(userType === 'user') {
        await userModel.findByIdAndUpdate(userId, {socketId: socket.id});
        const user = await userModel.findById(userId);
        console.log(`[SOCKET] Updated user socketId in DB:`, user?.socketId);
      } else if(userType === 'captain') {
        await captainModel.findByIdAndUpdate(userId, {socketId: socket.id});
        const captain = await captainModel.findById(userId);
        console.log(`[SOCKET] Updated captain socketId in DB:`, captain?.socketId);
      }
    });

//        socket.on('update-location-captain', async (data) => {
//         const { userId, location } = data;

//         if (!location || !location.ltd || !location.lng) {
//             return socket.emit('error', { message: 'Invalid location data' });
//         }

//         await captainModel.findByIdAndUpdate(userId, {
//             location: {
//                ltd: location.ltd,
//                lng: location.lng
//             }
//         });

// });

socket.on('update-location-captain', async (data) => {
  try {
    // 1) Raw data log
    console.log('📩 update-location-captain received:', JSON.stringify(data));

    const { userId, location } = data;

    // 2) Validate payload
    if (
      !userId ||
      !location ||
      typeof location.ltd !== 'number' ||
      typeof location.lng !== 'number'
    ) {
      console.warn('❗ Invalid payload for update-location-captain:', data);
      return socket.emit('error', { message: 'Invalid location data' });
    }

    // 3) Update using $set + dotted paths (strict-friendly)
    const update = {
      $set: {
          "location.ltd": data.location.ltd,   // dhyaan se spelling same rakho
          "location.lng": data.location.lng,
      },
    };

    const updated = await captainModel.findByIdAndUpdate(
      userId,
      update,
      {
        new: true,
        runValidators: true,   // schema validators run
        strict: true           // unknown paths strip (good if schema is correct)
      }
    );

    if (!updated) {
      console.warn('❗ Captain not found for ID:', userId);
      return socket.emit('error', { message: 'Captain not found' });
    }

    // 4) Read-back verify (definitive proof it’s in DB)
    const verify = await captainModel.findById(userId).select('location');
    console.log('✅ Location in DB now:', verify?.location);

    // 5) Optional: ack back to client
    socket.emit('location-updated', { ok: true, location: verify?.location });

  } catch (error) {
    console.error('❌ Error updating location:', error);
    socket.emit('error', { message: 'Failed to update location' });
  }
});


        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

function sendMessageToSocketId(socketId , messageObject){
    console.log(`Sending message to socket ${socketId}:`, messageObject);
    if(io) {
    // Verify the socket exists in the adapter before emitting
    const targetSocket = io.sockets.sockets.get(socketId);
    if (targetSocket) {
      targetSocket.emit(messageObject.event, messageObject.data);
    } else {
      console.warn(`Target socket ${socketId} not connected — cannot emit event ${messageObject.event}`);
    }
    }else {
        console.error('Socket.io is not initialized');
    }
}

module.exports = {
    initializeSocket,
    sendMessageToSocketId
};

