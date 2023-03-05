//---------------------------------------------------------------------------
//
//  --- Cube.js ---
//
//    A simple, encapsulated Cube object
const DefaultNumSides = 8;
//
//  All of the parameters of this function are optional, although, it's
//    possible that the WebGL context (i.e., the "gl" parameter) may not
//    be global, so passing that is a good idea.
//
//  Further, the vertex- and fragment-shader ids assume that the HTML "id" 
//    attributes for the vertex and fragment shaders are named
//
//      Vertex shader:   "Cube-vertex-shader"
//      Fragment shader: "Cube-fragment-shader"
//
function Cube( gl, numSides, vertexShaderId, fragmentShaderId ) {
    // Initialize the shader pipeline for this object using either shader ids
    //   declared in the application's HTML header, or use the default names.
    //
    const vertShdr = vertexShaderId || "Cube-vertex-shader";
    const fragShdr = fragmentShaderId || "Cube-fragment-shader";
    // Initialize the object's shader program from the provided vertex
    //   and fragment shaders.  We make the shader program private to
    //   the object for simplicity's sake.
    // 
    const shaderProgram = initShaders( gl, vertShdr, fragShdr );
    if ( shaderProgram < 0 ) {
        alert( "Error: Cube shader pipeline failed to compile.\n\n" +
            "\tvertex shader id:  \t" + vertShdr + "\n" +
            "\tfragment shader id:\t" + fragShdr + "\n" );
        return; 
    }
    // Determine the number of vertices around the base of the Cube
    //
    const n = numSides || DefaultNumSides; // Number of sides 
    // We'll generate the Cube's geometry (vertex positions).  The Cube's
    //   base will be a one-unit radius circle in the XY plane, centered 
    //   at the origin.  The Cube's apex will be located one unit up the
    //   +Z access.  We'll build our positions using that specification,
    //   and some trigonometry.
    //
    // Initialize temporary arrays for the Cube's indices and vertex positions,
    //   storing the position and index for the base's center
    //
    
    positions = [ 0.0, 0.0, 0.0 ];
    indices = [ 0 ];
    // Generate the locations of the vertices for the base of the Cube.  
    //    Recall the base is in the XY plane (which means the z-coordinate
    //    is zero), and we use sines and cosines to find the rest of 
    //    the coordinates.
    //
    // Here we dynamically build up both the vertex locations (by pushing
    //   computed coordinates onto the end of the "positions" array), as well
    //   as the indices for the vertices.
    //

    positions.push( 0.0, 0.0, 0.0 );
    positions.push( 1.0, 0.0, 0.0 );
    positions.push( 1.0, 1.0, 0.0 );
    positions.push( 0.0, 1.0, 0.0 ); // back
    positions.push( 1.0, 0.0, 1.0 );
    positions.push( 1.0, 0.0, 0.0 );
    positions.push( 1.0, 1.0, 0.0 );
    positions.push( 1.0, 1.0, 1.0 ); // right
    positions.push( 0.0, 0.0, 1.0 );
    positions.push( 1.0, 0.0, 1.0 );
    positions.push( 1.0, 1.0, 1.0 );
    positions.push( 0.0, 1.0, 1.0 ); // front
    positions.push( 0.0, 0.0, 0.0 );
    positions.push( 0.0, 0.0, 1.0 );
    positions.push( 0.0, 1.0, 1.0 );
    positions.push( 0.0, 1.0, 0.0 ); // left
    positions.push( 0.0, 1.0, 1.0 );
    positions.push( 1.0, 1.0, 1.0 );
    positions.push( 1.0, 1.0, 0.0 );
    positions.push( 0.0, 1.0, 0.0 ); // top
    positions.push( 0.0, 0.0, 0.0 );
    positions.push( 1.0, 0.0, 0.0 );
    positions.push( 1.0, 0.0, 1.0 );
    positions.push( 0.0, 0.0, 1.0 ); // bottom

    indices.push( 0 );
    indices.push( 1 );
    indices.push( 2 );
    indices.push( 0 );
    indices.push( 2 );
    indices.push( 3 ); // back
    indices.push( 5 );
    indices.push( 1 );
    indices.push( 2 );
    indices.push( 5 );
    indices.push( 2 );
    indices.push( 6 ); // right
    indices.push( 4 );
    indices.push( 5 );
    indices.push( 6 );
    indices.push( 4 );
    indices.push( 6 );
    indices.push( 7 ); // front
    indices.push( 0 );
    indices.push( 4 );
    indices.push( 7 );
    indices.push( 0 );
    indices.push( 7 );
    indices.push( 3 ); // left
    indices.push( 7 );
    indices.push( 6 );
    indices.push( 2 );
    indices.push( 7 );
    indices.push( 2 );
    indices.push( 3 ); // top
    indices.push( 0 );
    indices.push( 1 );
    indices.push( 5 );
    indices.push( 0 );
    indices.push( 5 );
    indices.push( 4 ); // bottom

    aPosition = new Attribute(gl, shaderProgram, positions, 
        "aPosition", 3, gl.FLOAT );
    indices = new Indices(gl, indices);
    //t = new Uniform(gl, shaderProgram, "t", gl.FLOAT);
        
    // Create a render function that can be called from our main application.
    //   In this case, we're using JavaScript's "closure" feature, which
    //   automatically captures variable values that are necessary for this
    //   routine so we can be less particular about variables scopes.  As 
    //   you can see, our "positions", and "indices" variables went out of
    //   scope when the Cube() constructor exited, but their values were
    //   automatically saved so that calls to render() succeed.
    // 
    this.render = function () {
        // Enable our shader program
        gl.useProgram( shaderProgram );
        // Activate our vertex, enabling the vertex attribute we want data
        //   to be read from, and tell WebGL how to decode that data.
        //
        aPosition.enable();
        // Likewise enable our index buffer so we can use it for rendering
        //
        indices.enable();
        // Since our list of indices contains equal-sized sets of
        //    indices values that we'll use to specify how many
        //    vertices to render, we divide the length of the 
        //    indices buffer by two, and use that as the "count"
        //    parameter for each of our draw calls.
        let count = indices.count / 12;
        // Draw the Cube's base.  Since our index buffer contains two
        //   "sets" of indices: one for the top, and one for the base,
        //   we divide the number of indices by two to render each
        //   part separately
        //
        gl.drawElements( gl.TRIANGLES, count, indices.type, 0 );
        // Draw the Cube's top.  In this case, we need to let WebGL know
        //   where in the index list we want it to start reading index
        //   values.  The offset value is in bytes, computed using the
        //   "count" value we computed when making the list, and knowing
        //   the size in bytes of an unsigned short type.
        //
        var offset = count;
        for (i = 0; i < 11; i++)
        {
            gl.drawElements( gl.TRIANGLES, count, indices.type, offset );
            offset += count;
        }    
        // Finally, reset our rendering state so that other objects we
        //   render don't try to use the Cube's data
        //
        aPosition.disable();
        indices.disable();
    }
};
