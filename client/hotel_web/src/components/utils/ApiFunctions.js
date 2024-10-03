import axios from "axios"

export const api = axios.create({
    baseURL: "http://localhost:8080"
})

export async function addRoom(photo, roomType , roomPrice) {

    const formData = new FormData()
    formData.append("photo", photo)
    formData.append("roomType", roomType)
    formData.append("roomPrice", roomPrice)

    const response = await api.post("/hotel/rooms/add/new-room", formData)
    if (response.status === 201) {
        return true
    } else {
        return false
    }
}

export async function getRoomTypes() {
    try {
        const response = await api.get("/hotel/rooms/room/types")
        return response.data
    } catch (error) {
        throw new Error("Error fetching room types")
    }
}

export async function getAllRooms() {
    try {
        const result = await api.get("/hotel/rooms/all-rooms")
        return result.data
    } catch (error) {
        throw new Error("Error fetching rooms")
    }
}

export async function deleteRoom(roomId) {
    try {
        const result = await api.delete(`/hotel/rooms/delete/${roomId}`)
        return result.data
    } catch (error) {
        throw new Error("Error fetching rooms")
    }
}

export async function updateRoom(roomId, roomData) {

    const formData = new FormData()
    formData.append("photo",roomData.photo)
    formData.append("roomType", roomData.roomType)
    formData.append("roomPrice", roomData.roomPrice)

    const response = await api.put(`/hotel/rooms/update/${roomId}`, formData)
    return response
    
}

export async function getRoomById(roomId) {
    try {
        const result = await api.get(`/hotel/rooms/room/${roomId}`)
        return result.data
    } catch (error) {
        throw new Error("Error fetching rooms")
    }
}

export async function bookRoom(roomId, booking) {
    try {
        const response = await api.post(`/hotel/bookings/room/${roomId}/booking`, booking)
        return response.data
    } catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error booking room : ${error.message}`)
		}
	}
}

export async function getBookingByConfirmationCode(confirmationCode) {
    try {
        const result = await api.get(`/hotel/bookings/confirmation/${confirmationCode}`)
        return result.data
    } catch (error) {
        if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error find booking : ${error.message}`)
		}
    }
}

export async function cancelBooking(bookingId) {
	try {
		const result = await api.delete(`/hotel/bookings/booking/${bookingId}/delete`)
		return result.data
	} catch (error) {
		throw new Error(`Error cancelling booking :${error.message}`)
	}
}

export async function getAllBookings() {
	try {
		const result = await api.get("/hotel/bookings/all-bookings")
		return result.data
	} catch (error) {
		throw new Error(`Error fetching bookings : ${error.message}`)
	}
}




