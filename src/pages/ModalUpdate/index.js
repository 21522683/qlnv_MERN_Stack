import React, { useEffect, useRef, useState } from 'react';
import classNames from "classnames/bind";
import styles from './ModalUpdate.module.scss';
import baseUrl from '../../utils';
import axios from 'axios';
import HashLoader from "react-spinners/HashLoader";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataUpdateStaff, setIsOpenModalUpdate } from '../../redux/slices/staffSlice';

const cx = classNames.bind(styles);
const formatDate = (dateString) => {
  const dateObject = new Date(dateString);
  const year = dateObject.getFullYear();
  let month = dateObject.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let day = dateObject.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  return `${year}-${month}-${day}`;
};

function ModalUpdate() {

  const indexUpdate = useSelector(state => state.staffManagement.indexUpdate);
  const staffsList = useSelector(state => state.staffManagement.staffsList);
  const itemStaff = staffsList[indexUpdate];

  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(itemStaff.avatar);
  const [nameStaff, setNameStaff] = useState(itemStaff.name);
  const [birthdayStaff, setBirthdayStaff] = useState(formatDate(itemStaff.birthday));
  const [genderStaff, setGenderStaff] = useState(itemStaff.gender);
  const [textValidationName, setTextValidationName] = useState('');
  const [isOpenTextValidationName, setIsOpenTextValidationName] = useState(false);

  const dispatch = useDispatch();


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
    dispatch(setIsOpenModalUpdate(false));
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
  const updateStaff = async () => {
    if (handleValidateName()) {
      let staffData = {
        id: itemStaff._id,
        name: nameStaff,
        birthday: birthdayStaff,
        gender: genderStaff,
        avatar: imageSrc.imageBase64,
      }
      dispatch(fetchDataUpdateStaff(staffData));
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
            <span className={cx('title-modal')}>Cập nhật thông tin nhân viên</span>
            <span className={cx('close-modal')} onClick={handleClose}>&times;</span>
          </div>

          <div className={cx('container-name')}>
            <span className={cx('title-name')}>Họ tên: </span>
            <input className={cx('input-name')} type='text' value={nameStaff} onChange={(e) => setNameStaff(e.target.value)} />
          </div>
          {
            isOpenTextValidationName && <span className={cx('error-validation')}>{textValidationName}</span>
          }

          <div className={cx('container-birthday')}>
            <span className={cx('title-birthday')}>Ngày sinh: </span>
            <input className={cx('input-birthday')} type='date' value={birthdayStaff} onChange={(e) => setBirthdayStaff(e.target.value)} />
          </div>

          <div className={cx('container-gender')}>
            <span className={cx('title-gender')}>Giới tính: </span>
            <select className={cx('cbb-gender')} value={genderStaff} onChange={(e) => setGenderStaff(e.target.value)}>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div className={cx('container-avatar')}>
            <img className={cx('img-avatar')} src={imageSrc.url} alt="img" />
            <span className={cx('text-select-img')} onClick={handleChooseImage}>Chọn ảnh <input onChange={handleImageChange} ref={fileInputRef} className={cx('input-file')} type="file" /></span>
          </div>

          <div className={cx('container-button')} onClick={updateStaff}>
            Cập nhật
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalUpdate;
