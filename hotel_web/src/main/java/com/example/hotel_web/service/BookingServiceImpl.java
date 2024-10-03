package com.example.hotel_web.service;

import com.example.hotel_web.dto.response.BookingResponse;
import com.example.hotel_web.entity.BookedRoom;
import com.example.hotel_web.entity.Room;
import com.example.hotel_web.exception.AppException;
import com.example.hotel_web.exception.ErrorCode;
import com.example.hotel_web.repository.BookingRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingServiceImpl implements BookingService {

    BookingRepository bookingRepository;

    RoomService roomService;


    @Override
    public List<BookedRoom> getAllBookingsByRoomId(Long roomId) {
        return bookingRepository.findByRoomId(roomId);
    }

    @Override
    public List<BookedRoom> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public void cancelBooking(Long bookingId) {
        bookingRepository.deleteById(bookingId);
    }

    @Override
    public String saveBooking(Long roomId, BookedRoom bookingRequest) {
        if (bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())){
            throw new AppException(ErrorCode.ERROR_CHECK1);
        }
        Room room = roomService.getRoomById(roomId).get();
        List<BookedRoom> existingBookings = room.getBookings();
        boolean roomIsAvailable = roomIsAvailable(bookingRequest,existingBookings);
        if (roomIsAvailable){
            room.addBooking(bookingRequest);

            bookingRepository.save(bookingRequest);
        }else{
            throw  new AppException(ErrorCode.ERROR_CHECK2);
        }
        return bookingRequest.getBookingConfirmationCode();
    }

    @Override
    public BookedRoom findByBookingConfirmationCode(String confirmationCode) {
        return bookingRepository.findByBookingConfirmationCode(confirmationCode)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
    }

    @Override
    public List<BookedRoom> getBookingsByUserEmail(String email) {
        return bookingRepository.findByGuestEmail(email);
    }

    private boolean roomIsAvailable(BookedRoom bookingRequest, List<BookedRoom> existingBookings) {
        return existingBookings.stream()
                .noneMatch(existingBooking ->
                        //TH1: Kiểm tra xem ngày nhận phòng của yêu cầu mới có bằng với ngày nhận phòng của đặt phòng đã có hay không.
                        bookingRequest.getCheckInDate().equals(existingBooking.getCheckInDate())
                                //TH2: Kiểm tra xem ngày trả phòng của yêu cầu mới có xảy ra trước ngày trả phòng của đặt phòng hiện tại hay không.
                                || bookingRequest.getCheckOutDate().isBefore(existingBooking.getCheckOutDate())
                                //TH3: Kiểm tra xem ngày nhận phòng của yêu cầu mới có nằm giữa khoảng thời gian từ ngày nhận phòng đến ngày trả phòng của đặt phòng hiện tại hay không.
                                || (bookingRequest.getCheckInDate().isAfter(existingBooking.getCheckInDate())
                                && bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()))
                                //TH4: Kiểm tra xem yêu cầu mới bắt đầu trước khi đặt phòng hiện tại bắt đầu và kết thúc đúng vào ngày trả phòng của đặt phòng hiện tại.
                                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())
                                && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckOutDate()))
                                //TH5: Kiểm tra xem yêu cầu mới bắt đầu trước và kết thúc sau đặt phòng hiện tại (bao phủ toàn bộ thời gian của đặt phòng hiện tại).
                                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())
                                && bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckOutDate()))
                                //TH6: Kiểm tra xem ngày nhận phòng của yêu cầu mới có trùng với ngày trả phòng của đặt phòng hiện tại và ngược lại.
                                || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckInDate()))
                                //TH7: Kiểm tra xem ngày nhận phòng và trả phòng của yêu cầu mới có bằng nhau không. (Điều kiện này có thể không cần thiết hoặc nhầm lẫn trong ngữ cảnh này).
                                || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().equals(bookingRequest.getCheckInDate()))
                );
    }


}
