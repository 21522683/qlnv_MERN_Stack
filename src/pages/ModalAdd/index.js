import React, { useRef, useState, useEffect } from 'react'
import classNames from "classnames/bind";
import styles from './ModalAdd.module.scss'
import HashLoader from "react-spinners/HashLoader";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataAddStaff, setIsOpenModalAdd } from '../../redux/slices/staffSlice';

const cx = classNames.bind(styles)

function ModalAdd({pathWithQuery, queryParamsString}) {
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState({});
  const [nameStaff, setNameStaff] = useState('');
  const [birthdayStaff, setBirthdayStaff] = useState(new Date());
  const [genderStaff, setGenderStaff] = useState('Nam');
  const [defaultDate, setDefaultDate] = useState('');
  const [textValidationName, setTextValidationName] = useState('');
  const [isOpenTextValidationName, setIsOpenTextValidationName] = useState(false);
  const [textValidationImage, setTextValidationImage] = useState('');
  const [isOpenTextValidationImage, setIsOpenTextValidationImage] = useState(false);
  const dispatch = useDispatch()
  useEffect(() => {
    const today = new Date();
    const formattedDate = formatDate(today);
    setDefaultDate(formattedDate);
    setBirthdayStaff(today);
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    setBirthdayStaff(selectedDate);
  };

  const handleChooseImage = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (allowedTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageSrc({
            name: file.name,
            url: URL.createObjectURL(file),
            imageBase64: reader.result,
          });
        };
        reader.readAsDataURL(file);
      } else {
        alert("Vui lòng chọn một tệp hình ảnh (JPEG, PNG, hoặc GIF).");
        event.target.value = null;
      }
    }
  };

  const handleClose = () => {
    dispatch(setIsOpenModalAdd(false));
  }

  useEffect(() => {
    let boolCheck = handleValidateName();
  }, [nameStaff]);

  const handleValidateName = () => {
    if (nameStaff.trim().length === 0 || nameStaff.trim() === '') {
      setIsOpenTextValidationName(true);
      setTextValidationName("Vui lòng nhập đầy đủ họ tên !")
      return false;
    } else {
      setIsOpenTextValidationName(false);
      setTextValidationName("")
      return true;
    }
  }

  useEffect(() => {
    let boolCheck = handleValidateImage();
  }, [imageSrc]);

  const handleValidateImage = () => {
    if (imageSrc.url === null || imageSrc.url === undefined || imageSrc.url === '') {
      setIsOpenTextValidationImage(true);
      setTextValidationImage("Vui lòng chọn hình ảnh !");
      return false;
    } else {
      setIsOpenTextValidationImage(false);
      setTextValidationImage("");
      return true;
    }
  }
  
  
  const addNewStaff = async () => {
    if (handleValidateImage() == true && handleValidateName() == true) {
      let staffData = {
        name: nameStaff,
        birthday: birthdayStaff,
        gender: genderStaff,
        avatar: imageSrc.imageBase64,
      }
      dispatch(fetchDataAddStaff([staffData, pathWithQuery, queryParamsString]));
    }
  };
  const loading = useSelector(state => state.staffManagement.isLoading);

  return (
    <>
      {loading && (
        <div className={cx("container-loader")}>
          <HashLoader
            color="#0088af"
            loading={loading}
            size={80}
            aria-label="Loading Spinner"
            data-testid="loader"
            className={cx("loader-feedback")}
          />
        </div>
      )}
      <div className={cx('wrapper')} onClick={handleClose}>
        <div className={cx('container-body')} onClick={(e) => e.stopPropagation()}>
          <div className={cx('container-1')}>
            <span className={cx('title-modal')}>Thêm nhân viên</span>
            <span className={cx('close-modal')} onClick={handleClose}>&times;</span>
          </div>

          <div className={cx('container-name')}>
            <span className={cx('title-name')}>Họ tên: </span>
            <input className={cx('input-name')} type='text' value={nameStaff} onChange={(e) => setNameStaff(e.target.value)} placeholder="Họ và tên" />
          </div>
          {
            isOpenTextValidationName && <span className={cx('error-validation')}>{textValidationName}</span>
          }

          <div className={cx('container-birthday')}>
            <span className={cx('title-birthday')}>Ngày sinh: </span>
            <input className={cx('input-birthday')} type='date' value={birthdayStaff ? formatDate(birthdayStaff) : defaultDate} onChange={handleDateChange} />
          </div>

          <div className={cx('container-gender')}>
            <span className={cx('title-gender')}>Giới tính: </span>
            <select className={cx('cbb-gender')} value={genderStaff} onChange={(e) => setGenderStaff(e.target.value)}>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div className={cx('container-avatar')}>
            <img className={cx('img-avatar')} src={imageSrc.url} alt="Avatar" />
            <span className={cx('text-select-img')} onClick={handleChooseImage}>Chọn ảnh <input onChange={handleImageChange} ref={fileInputRef} className={cx('input-file')} type="file" /></span>
          </div>
          {
            isOpenTextValidationImage && <span className={cx('error-validation-image')}>{textValidationImage}</span>
          }
          <div className={cx('container-button')} onClick={addNewStaff}>
            Thêm nhân viên
          </div>
        </div>
      </div>
    </>

  )
}

export default ModalAdd;
