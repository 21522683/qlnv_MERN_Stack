import React, { useState } from 'react'
import classNames from "classnames/bind";
import styles from './MessageBoxDelete.module.scss'
import axios from 'axios';
import baseUrl from '../../utils';
import HashLoader from "react-spinners/HashLoader";
import { fetchDataDeleteStaff, fetchDataGetAllStaff, setIsOpenModalDelete } from '../../redux/slices/staffSlice';
import { useDispatch, useSelector } from 'react-redux';

const cx = classNames.bind(styles)

function MessageBoxDelete({pathWithQuery, queryParamsString}) {

  const dispatch = useDispatch();
  const indexUpdate = useSelector(state => state.staffManagement.indexUpdate);
  const staffsList = useSelector(state => state.staffManagement.staffsList);
  const itemStaff = staffsList[indexUpdate];
  const loading = useSelector(state => state.staffManagement.isLoading);

  const handleClose = () => {
    dispatch(setIsOpenModalDelete(false));
  }

  const deleteStaff = async () => {
    
    dispatch(fetchDataDeleteStaff([itemStaff._id, pathWithQuery, queryParamsString]));
  }

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
            <span className={cx('title-modal')}>Thông báo</span>
            <span className={cx('close-modal')} onClick={handleClose}>&times;</span>
          </div>

          <div className={cx('container-2')}>
            <span className={cx('text-modal')}>Bạn có chắc chắn muốn xóa nhân viên này?</span>
          </div>


          <div className={cx('container-button')}>
            <div className={cx('button-cancel')} onClick={handleClose}>
              Hủy
            </div>
            <div className={cx('button-confirm')} onClick={deleteStaff}>
              Xác nhận
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MessageBoxDelete;
