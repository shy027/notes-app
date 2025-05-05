import React from 'react';

const Pagination = ({ data, page, limit, onPageChange }) => {
  // 计算总页数
  const totalPages = Math.ceil(data.length / limit);
  
  // 获取当前页的数据
  const getCurrentPageData = () => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return data.slice(start, end);
  };

  // 获取分页信息
  const getPaginationInfo = () => {
    return {
      currentPage: page,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  };

  return (
    <div>
      {getCurrentPageData().map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );
};

export default Pagination;