import React, { useEffect } from 'react';

function Ntq({ formik }) {

  useEffect(() => {
    const { options, ...rest } = formik.values;

    formik.setValues({
      ...rest,
      // keep existing min & max
      min: formik.values.min ?? "",
      max: formik.values.max ?? ""
    });
  }, []);

  return (
    <div>
      <h1 className='text-sm text-gray-500 my-2'>NTQ type options</h1>

      <div className='grid md:grid-cols-2 gap-6'>

        {/* Min Field */}
        <div>
          <h1 className='text-sm text-gray-500 my-2'>Min</h1>
          <input
            name="min"
            type="number"
            placeholder="Write min value"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.min || ""}
            className="appearance-none border w-full text-sm text-gray-500 px-4 my-2 py-3 bg-[#ebf8f8] border-gray-400 rounded-lg cursor-pointer hover:bg-[#d3f0f3] transition"
          />
          {formik.touched.min && formik.errors.min && (
            <span className="text-red-500 text-sm">{formik.errors.min}</span>
          )}
        </div>

        {/* Max Field */}
        <div>
          <h1 className='text-sm text-gray-500 my-2'>Max</h1>
          <input
            name="max"
            type="number"
            placeholder="Write max value"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.max || ""}
            className="appearance-none border w-full text-sm text-gray-500 px-4 my-2 py-3 bg-[#ebf8f8] border-gray-400 rounded-lg cursor-pointer hover:bg-[#d3f0f3] transition"
          />
          {formik.touched.max && formik.errors.max && (
            <span className="text-red-500 text-sm">{formik.errors.max}</span>
          )}
        </div>

      </div>
    </div>
  );
}

export default Ntq;
