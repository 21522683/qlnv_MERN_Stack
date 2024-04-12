const convertDate = (d) => {
    const date = new Date(d);

    // Lấy thông tin ngày, tháng, năm
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    // Tạo chuỗi ngày tháng định dạng 'DD-MM-YYYY'
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
}
export default convertDate;