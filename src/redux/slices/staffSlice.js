import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../utils';
import axios from 'axios';

const fetchDataGetAllStaff = createAsyncThunk('fetchDataGetAllStaff', async (arr) => {
  const response = await axios.get(arr[0], arr[1]);
  return response.data;
})

const fetchDataAddStaff = createAsyncThunk('fetchDataAddStaff', async (arr) => {
    const data = await axios.post(`${baseUrl}/api/staffs/addNewStaff`, arr[0]);
    const response = await axios.get(arr[1], arr[2]);
    return response.data;
});

const fetchDataUpdateStaff = createAsyncThunk('fetchDataUpdateStaff', async (staffData) => {
  const data = await axios.put(`${baseUrl}/api/staffs/updateStaff/${staffData.id}`, staffData);
  return data.data;
});

const fetchDataDeleteStaff = createAsyncThunk('fetchDataDeleteStaff', async (arr) => {
  const mess = await axios.delete(`${baseUrl}/api/staffs/deleteStaff/${arr[0]}`);
  const response = await axios.get(arr[1], arr[2]);

  return response.data;
});

const staffsSlice = createSlice({
  name: 'staffs',
  initialState: {

    staffsList: [],
    indexUpdate: -1,
    isOpenModalAdd: false,
    isOpenModalUpdate: false,
    isOpenModalDelete: false,
    isLoading: false,
    totalPages: 1,
    error: null,

  },
  reducers: {
    setIsOpenModalAdd: (state, action) => {
      state.isOpenModalAdd = action.payload;
    },
    setIsOpenModalUpdate: (state, action) => {
      state.isOpenModalUpdate = action.payload;
    },
    setIsOpenModalDelete: (state, action) => {
      state.isOpenModalDelete = action.payload;
    },
    setIndexStaffSelected: (state, action) => {
      state.indexUpdate = action.payload;
    }
  },
  extraReducers: (builder) => {
    // getAllStaff 
    builder.addCase(fetchDataGetAllStaff.pending, (state,action) => {

    });
    builder.addCase(fetchDataGetAllStaff.fulfilled, (state,action) => {
      state.staffsList = [...action.payload.staffs];
      state.isLoading = false;
      state.totalPages = action.payload.totalPages;
    });
    builder.addCase(fetchDataGetAllStaff.rejected, (state,action) => {
      state.error = action.error.message;
    });

    // Add staff 
    builder.addCase(fetchDataAddStaff.pending, (state,action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchDataAddStaff.fulfilled, (state, action) => {
      state.staffsList = [...action.payload.staffs];
      state.isLoading = false;
      state.isOpenModalAdd = false;
      state.totalPages = action.payload.totalPages;
    });
    builder.addCase(fetchDataAddStaff.rejected, (state,action) => {
      state.isLoading = false;
      state.error = action.error.message;
      state.isOpenModalAdd = false;
    });

    // Update staff 
    builder.addCase(fetchDataUpdateStaff.pending, (state,action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchDataUpdateStaff.fulfilled, (state, action) => {
      state.staffsList = [...state.staffsList].map((item, index) => {
        if (item._id === action.payload._id) {
          return action.payload;
        }
        return item;
      })
      state.isLoading = false;
      state.isOpenModalUpdate = false;
    });
    builder.addCase(fetchDataUpdateStaff.rejected, (state,action) => {
      state.isLoading = false;
      state.error = action.error.message;
      state.isOpenModalUpdate = false;
    });

    // Delete staff
    builder.addCase(fetchDataDeleteStaff.pending, (state,action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchDataDeleteStaff.fulfilled, (state, action) => {
      state.staffsList = [...action.payload.staffs];
      state.isLoading = false;
      state.isOpenModalDelete = false;
      state.totalPages = action.payload.totalPages;
    });
    
    builder.addCase(fetchDataDeleteStaff.rejected, (state,action) => {
      state.isLoading = false;
      state.error = action.error.message;
      state.isOpenModalDelete = false;
    });

  }
});

export const { setIsOpenModalAdd, setIsOpenModalUpdate, setIsOpenModalDelete, setIndexStaffSelected } = staffsSlice.actions;
export default staffsSlice.reducer;
export {
  fetchDataGetAllStaff,
  fetchDataAddStaff,
  fetchDataUpdateStaff,
  fetchDataDeleteStaff
}
